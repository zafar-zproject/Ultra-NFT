import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import LiveStream from './components/LiveStream';
import BannerCards from './components/BannerCards';
import ActionGrid from './components/ActionGrid';
import ShopSection from './components/ShopSection';
import RocketGame from './components/RocketGame';
import MinesGame from './components/MinesGame';
import { TabType } from './types';
import { syncUser, updateUserBalance, UserProfile, TransactionRecord, subscribeToTransactions, recordTransaction, auth } from './lib/firebase';
import TransactionHistory from './components/TransactionHistory';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [balance, setBalance] = useState(9000000.00);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [activeGame, setActiveGame] = useState<'none' | 'rocket' | 'mines'>('none');

  useEffect(() => {
    let unsubscribeTx: () => void = () => {};

    const initApp = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
          const profile = await syncUser(tgUser);
          if (profile) {
            setUserProfile(profile);
            setBalance(profile.balance);
            
            // Subscribe to transactions once auth is ready
            unsubscribeTx = subscribeToTransactions((txs) => {
              setTransactions(txs);
            });
          }
        }
      }
    };
    initApp();
    return () => unsubscribeTx();
  }, []);

  const addStars = async (stars: number) => {
    const tonEquivalent = stars * 0.0025;
    const newBalance = balance + tonEquivalent;
    setBalance(newBalance);
    await updateUserBalance(newBalance);
    
    // Log transaction
    await recordTransaction({
      userId: auth.currentUser?.uid || '',
      type: 'deposit',
      amount: tonEquivalent,
      description: `Stars Deposit (+${stars}⭐️)`,
      timestamp: null
    });

    setShowTopUp(false);
  };

  const handleWin = useCallback(async (amount: number) => {
    setBalance(prev => {
      const newBalance = prev + amount;
      updateUserBalance(newBalance);
      return newBalance;
    });
  }, []);

  const handleLose = useCallback(async (amount: number) => {
    setBalance(prev => {
      const newBalance = prev - amount;
      updateUserBalance(newBalance);
      return newBalance;
    });
  }, []);

  const handleOpenBox = useCallback((cost: number) => {
    let success = false;
    setBalance(prev => {
      if (prev >= cost) {
        success = true;
        const newBalance = prev - cost;
        updateUserBalance(newBalance);
        return newBalance;
      }
      return prev;
    });
    return success;
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-white max-w-md mx-auto relative overflow-x-hidden pb-32 pt-2 glow-mesh font-sans">
      <div className="fixed -top-20 -left-20 w-80 h-80 bg-brand-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-1/2 -right-20 w-80 h-80 bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Header 
        balance={balance} 
        photoUrl={userProfile?.photoUrl} 
        firstName={userProfile?.firstName} 
        onPortfolioClick={() => setShowHistory(true)}
      />

      <main className="flex flex-col gap-4 relative z-10">
        <LiveStream />

        {activeTab === 'home' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div onClick={(e: any) => {
              const target = (e.target as HTMLElement).closest('.cursor-pointer');
              if (!target) return;
              const text = target.textContent?.toLowerCase();
              if (text?.includes('rocket')) setActiveGame('rocket');
              if (text?.includes('mines')) setActiveGame('mines');
            }}>
              <BannerCards />
            </div>
            
            <div className="px-4">
               <button 
                 onClick={() => setShowTopUp(true)}
                 className="w-full h-14 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl flex items-center justify-between px-6 active:scale-95 transition-all text-brand-purple"
               >
                 <div className="flex items-center gap-3">
                   <span className="text-xl font-black">⭐️</span>
                   <span className="text-xs font-black uppercase tracking-widest">Deposit Stars</span>
                 </div>
                 <span className="text-[10px] font-black uppercase bg-brand-purple/20 px-2 py-1 rounded-md">Bonus +5%</span>
               </button>
            </div>

            <ActionGrid />
            <ShopSection balance={balance} onOpenBox={handleOpenBox} />
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

      {/* Game Modals */}
      {activeGame === 'rocket' && (
        <RocketGame 
          balance={balance} 
          onWin={handleWin} 
          onLose={handleLose} 
          onClose={() => setActiveGame('none')} 
        />
      )}

      {activeGame === 'mines' && (
        <MinesGame 
          balance={balance} 
          onWin={handleWin} 
          onLose={handleLose} 
          onClose={() => setActiveGame('none')} 
        />
      )}

      {showTopUp && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTopUp(false)} />
           <div className="relative bg-brand-bg border-t border-x border-white/10 rounded-t-[40px] w-full max-h-[90vh] p-8 pb-12 overflow-y-auto hide-scrollbar flex flex-col gap-6 animate-in slide-in-from-bottom-full duration-300">
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto" />
              <div className="flex flex-col items-center text-center gap-2">
                 <h2 className="text-2xl font-black uppercase font-display italic tracking-tighter">Top Up with Stars</h2>
                 <p className="text-white/40 text-xs font-medium">Select amount to deposit and get TON instantly</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 {[50, 250, 500, 1000].map((stars) => (
                   <button 
                     key={stars}
                     onClick={() => addStars(stars)}
                     className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col items-center gap-1 active:scale-95 transition-all hover:bg-white/10 group"
                   >
                     <span className="text-2xl group-hover:scale-125 transition-transform">⭐️ {stars}</span>
                     <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">≈ {(stars * 0.0025).toFixed(3)} TON</span>
                   </button>
                 ))}
              </div>

              <p className="text-[9px] text-white/20 text-center uppercase tracking-widest font-black italic">Calculation: 1 TON ≈ 400 Stars</p>
           </div>
        </div>
      )}

      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {showHistory && (
        <TransactionHistory 
          transactions={transactions} 
          onClose={() => setShowHistory(false)} 
        />
      )}
    </div>
  );
}

