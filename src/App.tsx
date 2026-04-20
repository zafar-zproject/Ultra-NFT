import { useState } from 'react';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import LiveStream from './components/LiveStream';
import BannerCards from './components/BannerCards';
import ActionGrid from './components/ActionGrid';
import ShopSection from './components/ShopSection';
import { TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  return (
    <div className="min-h-screen bg-brand-bg text-white max-w-md mx-auto relative overflow-x-hidden pb-32 pt-2 glow-mesh font-sans">
      <div className="fixed -top-20 -left-20 w-80 h-80 bg-brand-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-1/2 -right-20 w-80 h-80 bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Header />

      <main className="flex flex-col gap-4 relative z-10">
        <LiveStream />

        {activeTab === 'home' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BannerCards />
            <ActionGrid />
            <ShopSection />
          </div>
        )}

        {activeTab !== 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center pt-24 px-10 text-center gap-6 animate-in zoom-in-95 duration-500">
             <div className="relative">
                <div className="absolute inset-0 bg-brand-purple/20 blur-2xl rounded-full" />
                <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-xl float-animation">
                   <span className="text-5xl drop-shadow-lg">✨</span>
                </div>
             </div>
             <div className="flex flex-col gap-2 relative z-10">
                <h2 className="text-2xl font-black uppercase font-display italic tracking-tighter">
                  {activeTab}<br/>Coming Soon
                </h2>
                <p className="text-white/30 text-sm font-medium">
                  We're crafting something legendary.<br/>Stay tuned for the drop.
                </p>
             </div>
             <button 
               onClick={() => setActiveTab('home')}
               className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
             >
               Go Back Home
             </button>
          </div>
        )}
      </main>

      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

