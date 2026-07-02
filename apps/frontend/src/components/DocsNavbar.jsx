import { Link, useNavigate } from 'react-router-dom';

export default function DocsNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <header className="h-16 border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/docs')}>
          <img src="/creep.png" alt="MCloud" className="w-8 h-8 object-contain" />
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-white tracking-wide">MCloud</span>
            <span className="font-medium text-primary text-sm tracking-wide">Docs</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
        <div className="flex items-center gap-4">
          {token ? (
            <Link to="/dashboard" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition">Dasbor</Link>
          ) : (
            <>
              <Link to="/login" className="hover:text-white transition font-bold hidden sm:block">Masuk</Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
