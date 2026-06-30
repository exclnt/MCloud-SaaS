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
          Premium Minecraft server hosting with exceptional performance, reliability, and 24/7 support.
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-12 flex-1">
        <div>
          <h4 className="font-bold text-xs text-white uppercase mb-4 tracking-wider">Services</h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li className="hover:text-white cursor-pointer transition">Minecraft Hosting</li>
            <li className="hover:text-white cursor-pointer transition">Free Minecraft Hosting</li>
            <li className="hover:text-white cursor-pointer transition">Dedicated Servers</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs text-white uppercase mb-4 tracking-wider">Community</h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li className="hover:text-white cursor-pointer transition">Community Forums</li>
            <li className="hover:text-white cursor-pointer transition">Minecraft Server List</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs text-white uppercase mb-4 tracking-wider">Resources</h4>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li className="hover:text-white cursor-pointer transition">Terms of Service</li>
            <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
