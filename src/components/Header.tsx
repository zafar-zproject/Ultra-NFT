import { Settings, Wallet, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
}

interface HeaderProps {
  balance: number;
}

export default function Header({ balance }: HeaderProps) {
  const [userData, setUserData] = useState({
    name: 'Player',
    photoUrl: 'https://picsum.photos/seed/user_premium/100/100'
  });

  useEffect(() => {
    if (window.Telegram?.WebApp.initDataUnsafe.user) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      setUserData({
        name: user.first_name || 'Player',
        photoUrl: user.photo_url || 'https://picsum.photos/seed/user_premium/100/100'
      });
    }
  }, []);

  return (
    <header className="flex items-center justify-between px-6 pt-5 pb-4 bg-transparent sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple/40 to-brand-blue/40 p-[1px] backdrop-blur-xl transition-transform active:scale-95 cursor-pointer">
            <div className="w-full h-full rounded-2xl bg-brand-bg relative overflow-hidden p-1">
              <img 
                src={userData.photoUrl} 
                alt={userData.name} 
                className="w-full h-full rounded-xl object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/100/100';
                }}
              />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-bg rounded-lg flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
            <div className="w-full h-full bg-brand-purple/20 flex items-center justify-center">
              <Bell className="w-2.5 h-2.5 text-brand-purple" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-brand-purple uppercase tracking-[0.2em] leading-none mb-1">Portfolio</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand-blue/20 rounded-lg flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-brand-blue rotate-45 rounded-[1px] shadow-[0_0_12px_#00A3FF]" />
            </div>
            <span className="text-xl font-black font-display tracking-tight leading-none italic">{balance.toFixed(3)} TON</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group active:scale-90 transition-all hover:bg-white/10">
          <Settings className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
        </button>
        <button className="bg-brand-orange text-white p-1 rounded-[18px] flex items-center pr-4 gap-2 shadow-[0_10px_30px_rgba(255,138,0,0.2)] active:scale-95 transition-all group overflow-hidden relative">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-black text-xs uppercase tracking-tight">Top Up</span>
        </button>
      </div>
    </header>
  );
}
