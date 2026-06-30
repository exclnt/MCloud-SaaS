import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-[#0a0a0a] p-8 flex flex-col md:flex-row gap-12 text-sm justify-center max-w-7xl mx-auto w-full mt-auto">
      <div className="flex-1 max-w-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">
            <span className="text-primary font-bold text-xs">M</span>
          </div>
          <span className="font-bold text-white">MCloud</span>
        </div>
        <p className="text-zinc-500 text-xs leading-relaxed">
          Hosting server Minecraft premium dengan performa luar biasa, keandalan, dan dukungan 24/7.
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 flex-1 mt-8 md:mt-0">
        <div>
          <h4 className="font-bold text-xs text-white uppercase mb-4 tracking-wider">Layanan</h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li className="hover:text-white cursor-pointer transition">Hosting Minecraft</li>
            <li className="hover:text-white cursor-pointer transition">Hosting Minecraft Gratis</li>
            <li className="hover:text-white cursor-pointer transition">Server Dedicated</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs text-white uppercase mb-4 tracking-wider">Komunitas</h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li className="hover:text-white cursor-pointer transition">Forum Komunitas</li>
            <li className="hover:text-white cursor-pointer transition">Daftar Server Minecraft</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs text-white uppercase mb-4 tracking-wider">Sumber Daya</h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li><Link to="/terms" className="hover:text-white transition">Syarat & Ketentuan</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Kebijakan Privasi</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
