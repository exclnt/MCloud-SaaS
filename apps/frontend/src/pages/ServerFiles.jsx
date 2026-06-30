import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../services/api';
import { Folder, File, Loader2, Upload, FilePlus, FolderPlus, RefreshCw, X, Save, Trash2, ArchiveRestore } from 'lucide-react';

export default function ServerFiles() {
  const { serverInfo } = useOutletContext();
  const port = serverInfo.port;
  
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingFile, setEditingFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const fetchFiles = async (path) => {
    setLoading(true);
    try {
      const data = await api.getFiles(port, path);
      // Sort: folders first, then files alphabetically
      data.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      });
      setFiles(data);
      setCurrentPath(path);
    } catch (e) {
      alert('Failed to load files: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [port]);

  const handleNavigate = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    fetchFiles(newPath);
  };

  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    fetchFiles(parts.join('/'));
  };
  
  const handleNavigateBreadcrumb = (index) => {
    const parts = currentPath.split('/');
    const newPath = parts.slice(0, index + 1).join('/');
    fetchFiles(newPath);
  }

  const handleOpenFile = async (file) => {
    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
    setLoading(true);
    try {
      const { content } = await api.readFile(port, filePath);
      setEditingFile(file);
      setFileContent(content);
    } catch (e) {
      alert('Failed to read file: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFile = async () => {
    const filePath = currentPath ? `${currentPath}/${editingFile.name}` : editingFile.name;
    setSaving(true);
    try {
      await api.writeFile(port, filePath, fileContent);
      alert('File saved successfully!');
      setEditingFile(null);
      setFileContent('');
    } catch (e) {
      alert('Failed to save file: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFile = async (e, file) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    
    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
    try {
      await api.deleteFile(port, filePath);
      await fetchFiles(currentPath);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await api.uploadFile(port, currentPath, file);
      alert(file.name.endsWith('.zip') || file.name.endsWith('.mcworld') 
        ? 'World extracted successfully!' 
        : 'File uploaded successfully!');
      await fetchFiles(currentPath);
    } catch (err) {
      alert('Failed to upload: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (zipInputRef.current) zipInputRef.current.value = '';
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in h-full flex flex-col relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            File Manager
          </h1>
          <p className="text-zinc-500">Browse and manage server files</p>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <input 
            type="file" 
            accept=".zip,.mcworld"
            ref={zipInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary/10 transition rounded-lg text-sm font-semibold"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
            Upload File
          </button>
          <button 
            onClick={() => zipInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-500/10 transition rounded-lg text-sm font-semibold"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArchiveRestore className="w-4 h-4" />} 
            Upload & Extract Zip
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition rounded-lg text-sm font-semibold">
            <FilePlus className="w-4 h-4" /> New File
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary/10 transition rounded-lg text-sm font-semibold">
            <FolderPlus className="w-4 h-4" /> New Folder
          </button>
          <button onClick={() => fetchFiles(currentPath)} className="flex items-center gap-2 px-4 py-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition rounded-lg text-sm font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#101010] border border-zinc-800/60 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Breadcrumb / Toolbar */}
        <div className="bg-[#0a0a0a] border-b border-zinc-800/60 px-4 py-3 flex items-center gap-2 text-sm">
          <button 
            onClick={() => fetchFiles('')} 
            className="text-zinc-400 hover:text-white transition"
          >
            <Folder className="w-4 h-4" />
          </button>
          <span className="text-zinc-600">/</span>
          {currentPath && currentPath.split('/').map((part, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <button 
                onClick={() => handleNavigateBreadcrumb(i)}
                className={`${i === arr.length - 1 ? 'text-zinc-200 font-medium' : 'text-zinc-400 hover:text-white transition'}`}
              >
                {part}
              </button>
              {i < arr.length - 1 && <span className="text-zinc-600">/</span>}
            </div>
          ))}
        </div>

        {/* File List Header */}
        <div className="flex items-center border-b border-zinc-800/60 p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider bg-black/20">
          <div className="w-10 flex justify-center"><input type="checkbox" className="accent-primary" /></div>
          <div className="flex-1">Select All</div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 flex justify-center text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/40">
              {currentPath && (
                <div 
                  className="flex items-center p-3 hover:bg-zinc-800/30 cursor-pointer transition group"
                  onClick={handleNavigateUp}
                >
                  <div className="w-10 flex justify-center text-zinc-600">..</div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                      <Folder className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-zinc-300 group-hover:text-white transition">..</span>
                  </div>
                </div>
              )}
              
              {files.map((file, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 hover:bg-zinc-800/30 cursor-pointer transition group"
                  onClick={() => file.type === 'directory' ? handleNavigate(file.name) : handleOpenFile(file)}
                >
                  <div className="w-10 flex justify-center">
                    <input type="checkbox" className="accent-primary" onClick={e => e.stopPropagation()} />
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] flex items-center justify-center border border-zinc-800 group-hover:border-zinc-700 transition">
                      {file.type === 'directory' ? (
                        <Folder className="w-4 h-4 text-blue-400" />
                      ) : (
                        <File className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-zinc-300 group-hover:text-white transition font-mono">{file.name}</div>
                      {file.type === 'file' && (
                        <div className="text-[10px] text-zinc-600 mt-0.5">{formatSize(file.size)} &bull; 3 days ago</div>
                      )}
                      {file.type === 'directory' && (
                        <div className="text-[10px] text-zinc-600 mt-0.5">3 days ago</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleDeleteFile(e, file)}
                      className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-10 flex justify-center text-zinc-600 group-hover:text-zinc-400">
                      <span className="text-xl leading-none">&rsaquo;</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {files.length === 0 && (
                <div className="p-8 text-center text-zinc-500">
                  This directory is empty.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {editingFile && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#101010]">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-white">{editingFile.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={saving}
                onClick={handleSaveFile}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg transition"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
              <button onClick={() => setEditingFile(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black p-4 overflow-hidden">
            <textarea
              className="w-full h-full bg-transparent text-zinc-300 font-mono text-sm resize-none focus:outline-none"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              spellCheck="false"
            />
          </div>
        </div>
      )}
    </div>
  );
}
