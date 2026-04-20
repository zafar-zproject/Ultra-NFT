import { Settings, Wallet, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 pt-8 pb-4 bg-transparent sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Avatar with Settings overlay */}
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple/40 to-brand-blue/40 p-[1px] backdrop-blur-xl">
            <div className="w-full h-full rounded-2xl bg-brand-bg relative overflow-hidden p-1">
              <img 
                src="https://picsum.photos/seed/user_premium/100/100" 
                alt="User" 
                className="w-full h-full rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
            <Bell className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        
        {/* Balance Display */}
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1">Portfolio</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand-blue/20 rounded-lg flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-brand-blue rotate-45 rounded-[1px] shadow-[0_0_12px_#0EA5E9]" />
            </div>
            <span className="text-xl font-black font-display tracking-tight leading-none italic">0.002 TON</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group active:scale-90 transition-all hover:bg-white/10">
          <Settings className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
        </button>
        <button className="bg-white text-black p-0.5 rounded-[18px] flex items-center pr-4 gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all group overflow-hidden relative">
          <div className="w-10 h-10 bg-brand-purple rounded-2xl flex items-center justify-center text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-black text-xs uppercase tracking-tight">Deposit</span>
        </button>
      </div>
    </header>
  );
}
