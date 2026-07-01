import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, Search, ChevronRight, ChevronLeft, Play, Server, Puzzle } from 'lucide-react';
import DocsNavbar from './DocsNavbar';
import Footer from './Footer';
import { docsCategories } from '../data/docsContent';

const IconMap = {
  Play: Play,
  Server: Server,
  Puzzle: Puzzle,
};

export default function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredCategories = docsCategories.map(cat => ({
    ...cat,
    articles: cat.articles.filter(art => 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.articles.length > 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <DocsNavbar />

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row relative">
        {/* Mobile Header / Sidebar Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800/60 bg-[#101010] sticky top-16 z-20">
          <div className="flex items-center gap-2 font-bold text-white">
            <BookOpen className="w-5 h-5 text-primary" />
            Dokumentasi
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 md:top-16 left-0 h-[100dvh] md:h-[calc(100vh-4rem)]
          w-64 bg-[#101010] md:bg-transparent border-r border-zinc-800/60
          overflow-y-auto transform transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 md:p-6 md:pt-10 flex flex-col h-full">
            <div className="md:hidden flex justify-between items-center mb-8">
              <span className="font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> MCloud Docs
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="mb-8 relative">
              <input 
                type="text" 
                placeholder="Cari dokumentasi..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2.5 pl-10 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </form>

            <div className="space-y-6 flex-1">
              {filteredCategories.length > 0 ? filteredCategories.map((cat) => {
                const CatIcon = IconMap[cat.icon] || BookOpen;
                return (
                  <div key={cat.id}>
                    <h3 className="flex items-center gap-2 font-bold text-white mb-3 text-sm">
                      <CatIcon className="w-4 h-4 text-primary" /> {cat.title}
                    </h3>
                    <ul className="space-y-1.5 pl-6 border-l border-zinc-800/60 ml-2">
                      {cat.articles.map(art => {
                        const path = `/docs/${cat.id}/${art.slug}`;
                        const isActive = location.pathname === path;
                        return (
                          <li key={art.slug}>
                            <Link 
                              to={path}
                              onClick={() => setSidebarOpen(false)}
                              className={`block text-sm py-1.5 px-3 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium border border-primary/20 -ml-[1px]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 -ml-[1px] border border-transparent'}`}
                            >
                              {art.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              }) : (
                <div className="text-center py-8">
                  <p className="text-zinc-500 text-sm">Tidak ada yang cocok.</p>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-zinc-800/60 mt-6">
              <button 
                onClick={() => navigate('/')} 
                className="text-sm text-zinc-500 hover:text-primary transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 md:min-h-0 min-h-[calc(100dvh-4rem-61px)] flex flex-col">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
