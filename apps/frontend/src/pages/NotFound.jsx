import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#0a0a0a] to-[#0a0a0a]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500 mb-4 opacity-80">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-zinc-400 mb-10 max-w-md mx-auto text-lg">
            Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-md transition"
            >
              <ArrowLeft className="w-5 h-5" /> Kembali
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              <Home className="w-5 h-5" /> Beranda
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
