import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Terminal as TerminalIcon, Search, Copy, Edit3, Send, Zap } from 'lucide-react';
import { api } from '../services/api';

export default function ServerConsole() {
  const { serverInfo, status } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [command, setCommand] = useState('');
  const logContainerRef = useRef(null);
  
  useEffect(() => {
    let interval;
    if (status === 'running') {
      const fetchLogs = async () => {
        try {
          const data = await api.getServerLogs(serverInfo.port);
          if (data && data.logs) {
            setLogs(data.logs.split('\n').filter(l => l));
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchLogs();
      interval = setInterval(fetchLogs, 2000);
    }
    return () => clearInterval(interval);
  }, [status, serverInfo.port]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!command.trim() || status !== 'running') return;

    const cmdToSend = command;
    setCommand('');
    setLogs(prev => [...prev, `> ${cmdToSend}`]);

    try {
      await api.sendCommand(serverInfo.port, cmdToSend);
    } catch (e) {
      alert("Gagal mengirim perintah: " + e.message);
    }
  };

  const insertCommand = (cmd) => {
    setCommand(cmd);
  };

  return (
    <div className="w-full px-4 sm:px-8 py-4 sm:py-8 max-w-7xl mx-auto space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <TerminalIcon className="w-5 h-5 text-primary" />
            </div>
            Konsol
          </h1>
          <p className="text-zinc-500">Kelola server Anda secara real-time</p>
        </div>
        <div className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${status === 'running' ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900' : 'bg-red-950/30 text-red-500 border-red-900'}`}>
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status === 'running' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {status.toUpperCase()}
        </div>
      </div>

      <div className="h-[60vh] min-h-[400px] max-h-[600px] flex flex-col bg-[#0a0a0a] border border-zinc-800/60 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-[#101010] border-b border-zinc-800/60 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
            <TerminalIcon className="w-4 h-4" /> Output Konsol
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2"></span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs rounded-md transition">
              <Search className="w-3.5 h-3.5" /> Cari
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs rounded-md transition">
              <Copy className="w-3.5 h-3.5" /> Salin Log
            </button>
          </div>
        </div>
        
        <div 
          ref={logContainerRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-300 bg-black"
        >
          {status === 'offline' ? (
            <div className="text-zinc-500">container@{serverInfo.name} Server ditandai sebagai offline.</div>
          ) : logs.length === 0 ? (
            <div className="text-zinc-500">Menunggu log...</div>
          ) : (
            logs.map((log, i) => {
              // Basic colorization for Minecraft logs
              let color = 'text-zinc-300';
              if (log.includes('WARN')) color = 'text-yellow-400';
              if (log.includes('ERROR') || log.includes('FATAL')) color = 'text-red-400';
              if (log.includes('INFO')) color = 'text-blue-300';
              if (log.startsWith('> ')) color = 'text-primary font-bold';
              
              return (
                <div key={i} className={`whitespace-pre-wrap break-all ${color}`}>
                  {log}
                </div>
              )
            })
          )}
        </div>

        <form onSubmit={handleCommand} className="border-t border-zinc-800/60 p-3 bg-[#101010] flex items-center gap-3">
          <span className="text-zinc-500 font-mono ml-2">{'>'}</span>
          <input 
            type="text" 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={status !== 'running'}
            placeholder="Ketik perintah..." 
            className="flex-1 bg-transparent text-sm text-zinc-200 font-mono focus:outline-none placeholder:text-zinc-600 disabled:opacity-50"
          />
        </form>
      </div>

      <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Zap className="w-5 h-5 text-primary" /> Perintah Cepat
          </div>
          <button className="text-zinc-500 hover:text-white transition flex items-center gap-1 text-xs">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => insertCommand('list')} className="text-left bg-black border border-zinc-800/60 p-4 rounded-xl hover:border-primary/50 hover:bg-zinc-900 transition group">
            <div className="font-mono text-primary text-sm font-bold group-hover:text-primary mb-1">list</div>
            <div className="text-xs text-zinc-500">Daftar pemain</div>
          </button>
          <button onClick={() => insertCommand('stop')} className="text-left bg-black border border-zinc-800/60 p-4 rounded-xl hover:border-primary/50 hover:bg-zinc-900 transition group">
            <div className="font-mono text-primary text-sm font-bold group-hover:text-primary mb-1">stop</div>
            <div className="text-xs text-zinc-500">Hentikan server</div>
          </button>
          <button onClick={() => insertCommand('whitelist add ')} className="text-left bg-black border border-zinc-800/60 p-4 rounded-xl hover:border-primary/50 hover:bg-zinc-900 transition group">
            <div className="font-mono text-primary text-sm font-bold group-hover:text-primary mb-1">whitelist add</div>
            <div className="text-xs text-zinc-500">Tambah ke daftar putih</div>
          </button>
          <button onClick={() => insertCommand('op ')} className="text-left bg-black border border-zinc-800/60 p-4 rounded-xl hover:border-primary/50 hover:bg-zinc-900 transition group">
            <div className="font-mono text-primary text-sm font-bold group-hover:text-primary mb-1">op</div>
            <div className="text-xs text-zinc-500">Berikan OP</div>
          </button>
        </div>
        <p className="text-zinc-600 text-[10px] mt-4">Klik perintah apa saja untuk memasukkannya ke kolom input konsol</p>
      </div>
    </div>
  );
}
