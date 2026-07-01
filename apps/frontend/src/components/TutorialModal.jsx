import { useState, useEffect } from 'react';
import { Terminal, Folder, Settings2, Shield, ArrowRight, ArrowLeft, X, CheckCircle2 } from 'lucide-react';

export default function TutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('mcloud_tutorial_seen');
    if (!hasSeenTutorial) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('mcloud_tutorial_seen', 'true');
  };

  const steps = [
    {
      title: "Selamat Datang di MCloud!",
      desc: "Mari ikuti tur singkat ini untuk mengenal fitur-fitur dasbor Anda. Kami telah mendesain panel ini agar mudah digunakan oleh siapa saja.",
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Konsol Server",
      desc: "Di menu Konsol, Anda dapat melihat aktivitas server (log) secara real-time. Anda juga bisa mengetik perintah (command) layaknya admin langsung dari sini.",
      icon: Terminal,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Pengelola File",
      desc: "Menu File memungkinkan Anda untuk mengunggah dunia (map), menambah plugin, mod, atau mengedit konfigurasi server langsung dari browser tanpa aplikasi tambahan.",
      icon: Folder,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      title: "Pengaturan Server",
      desc: "Ubah versi Minecraft, atur mode permainan, tingkat kesulitan, atau kelola whitelist server Anda dengan sangat mudah melalui menu Pengaturan.",
      icon: Settings2,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="relative bg-[#101010] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/creep.png" alt="MCloud" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-white text-sm">Tutorial MCloud</span>
          </div>
          <button onClick={handleClose} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 shadow-xl ${currentStep.bg}`}>
            <Icon className={`w-10 h-10 ${currentStep.color}`} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{currentStep.title}</h2>
          <p className="text-zinc-400 leading-relaxed min-h-[80px]">
            {currentStep.desc}
          </p>
        </div>

        {/* Footer / Navigation */}
        <div className="p-4 bg-[#0a0a0a] border-t border-zinc-800/60 flex items-center justify-between">
          <div className="flex gap-1.5 ml-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-zinc-800'}`}></div>
            ))}
          </div>
          
          <div className="flex gap-2">
            {step > 0 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition"
              >
                Kembali
              </button>
            )}
            
            {step < steps.length - 1 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-lg transition"
              >
                Lanjut <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleClose}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-lg transition"
              >
                Mulai Gunakan <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
