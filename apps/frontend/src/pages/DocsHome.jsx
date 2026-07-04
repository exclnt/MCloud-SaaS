import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Play, Server, Puzzle, CreditCard, Shield } from 'lucide-react';
import { docsCategories } from '../data/docsContent';

const IconMap = {
  Play: Play,
  Server: Server,
  Puzzle: Puzzle,
  CreditCard: CreditCard,
  Shield: Shield,
};

export default function DocsHome() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = docsCategories.map(cat => ({
    ...cat,
    articles: cat.articles.filter(art => 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.articles.length > 0);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 md:py-16 flex flex-col items-center">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 border border-primary/20">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Pusat Bantuan & Dokumentasi</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Temukan panduan lengkap untuk mengatur, mengelola, dan mengoptimalkan server Minecraft Anda di MCloud.
        </p>
      </div>

      <div className="w-full max-w-2xl mb-16 relative">
        <input 
          type="text" 
          placeholder="Cari artikel (contoh: cara pasang mod)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#101010] border border-zinc-800/60 rounded-xl py-4 pl-14 pr-6 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xl text-lg placeholder:text-zinc-600"
        />
        <Search className="w-6 h-6 text-zinc-500 absolute left-5 top-4" />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.length > 0 ? filteredCategories.map((cat) => {
          const CatIcon = IconMap[cat.icon] || BookOpen;
          return (
            <div key={cat.id} className="bg-[#101010] border border-zinc-800/60 p-6 md:p-8 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/50 transition flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                  <CatIcon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">{cat.title}</h2>
              </div>
              <p className="text-zinc-400 mb-6 flex-1 text-sm leading-relaxed">
                {cat.description}
              </p>
              
              <ul className="space-y-3 mb-6">
                {cat.articles.slice(0, 3).map(art => (
                  <li key={art.slug}>
                    <Link 
                      to={`/docs/${cat.id}/${art.slug}`}
                      className="text-sm text-zinc-300 hover:text-primary transition flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-primary transition-colors"></span>
                      {art.title}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <Link 
                to={`/docs/${cat.id}/${cat.articles[0].slug}`}
                className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto"
              >
                Mulai Membaca <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        }) : (
          <div className="col-span-1 md:col-span-2 text-center py-12">
            <p className="text-zinc-400 text-lg">Tidak ada artikel yang cocok dengan "{searchQuery}"</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
