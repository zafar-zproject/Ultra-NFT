import { Briefcase, Users, LayoutGrid, Trophy, Coins } from 'lucide-react';
import { TabType } from '../types';
import { motion } from 'motion/react';

interface NavigationBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs = [
  { id: 'backpack', icon: Briefcase, label: 'Backpack' },
  { id: 'invite', icon: Users, label: 'Invite' },
  { id: 'home', icon: LayoutGrid, label: 'Home' },
  { id: 'leaderboard', icon: Trophy, label: 'Leaders' },
  { id: 'earn', icon: Coins, label: 'Earn' },
] as const;

export default function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className="relative flex flex-col items-center justify-center py-2 px-3 transition-all flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-brand-purple rounded-2xl z-0"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={`relative z-10 flex flex-col items-center gap-1 ${isActive ? 'text-white' : 'text-white/40'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
