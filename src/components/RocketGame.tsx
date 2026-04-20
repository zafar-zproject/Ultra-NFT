import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Wallet, TrendingUp, X, Heart } from 'lucide-react';

interface RocketGameProps {
  balance: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onClose: () => void;
}

export default function RocketGame({ balance, onWin, onLose, onClose }: RocketGameProps) {
  const [gameState, setGameState] = useState<'idle' | 'running' | 'crashed' | 'won'>('idle');
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState(0.1);
  const [crashValue, setCrashValue] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startLevel = () => {
    if (balance < bet) return;
    
    // Random crash value between 1.01 and 20.00
    const randomCrash = 1 + Math.random() * 19;
    setCrashValue(randomCrash);
    setMultiplier(1.0);
    setGameState('running');
    
    timerRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = prev + 0.05 * (prev / 2); // Exponential growth
        if (next >= randomCrash) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState('crashed');
          onLose(bet);
          return randomCrash;
        }
        return next;
      });
    }, 100);
  };

  const cashOut = () => {
    if (gameState !== 'running') return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    const win = bet * multiplier;
    setWinAmount(win);
    setGameState('won');
    onWin(win - bet); // The function expects the profit or the final balance adjust
  };

  const reset = () => {
    setGameState('idle');
    setMultiplier(1.0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative bg-brand-bg border border-white/10 rounded-[40px] w-full max-w-sm overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Game Area */}
        <div className="h-64 relative bg-black/40 flex flex-col items-center justify-center overflow-hidden">
           {/* Background Stars/Glow */}
           <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse" />
              <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-75" />
              <div className="absolute bottom-20 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-150" />
           </div>

           <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={gameState === 'running' ? {
                  y: [-2, 2, -2],
                  rotate: [10, 15, 10]
                } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className={`text-6xl mb-4 transition-all duration-500 ${gameState === 'crashed' ? 'grayscale opacity-50' : ''}`}
              >
                🚀
              </motion.div>
              
              <div className={`text-6xl font-black font-display tracking-tighter italic transition-colors duration-300
                ${gameState === 'crashed' ? 'text-red-500' : gameState === 'won' ? 'text-brand-green' : 'text-white'}
              `}>
                {multiplier.toFixed(2)}x
              </div>

              {gameState === 'crashed' && (
                <div className="mt-2 text-red-500 font-black uppercase text-xs tracking-widest animate-bounce">
                  CRASHED @ {multiplier.toFixed(2)}x
                </div>
              )}
           </div>

           {/* Close Button */}
           <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
             <X className="w-4 h-4 text-white/40" />
           </button>
        </div>

        {/* Controls */}
        <div className="p-8 flex flex-col gap-6">
           <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Wager Amount</span>
                <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">{(balance).toFixed(3)} TON Avail.</span>
              </div>
              <div className="flex gap-2">
                 {[0.05, 0.1, 0.5, 1.0].map((val) => (
                   <button 
                     key={val}
                     onClick={() => setBet(val)}
                     className={`flex-1 py-3 rounded-2xl border text-xs font-black transition-all ${bet === val ? 'bg-brand-purple border-brand-purple' : 'bg-white/5 border-white/10 text-white/40'}`}
                   >
                     {val}
                   </button>
                 ))}
              </div>
           </div>

           {gameState === 'idle' || gameState === 'crashed' || gameState === 'won' ? (
             <button 
               onClick={startLevel}
               disabled={balance < bet}
               className="w-full h-16 bg-brand-orange rounded-[24px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,138,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               <Rocket className="w-5 h-5" />
               Take Off
             </button>
           ) : (
             <button 
               onClick={cashOut}
               className="w-full h-16 bg-brand-green text-brand-bg rounded-[24px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(55,255,148,0.3)] active:scale-95 transition-all flex flex-col items-center justify-center -gap-1"
             >
               <span className="text-xs">Cash Out</span>
               <span className="text-lg">+{(bet * multiplier).toFixed(3)} TON</span>
             </button>
           )}
           
           <p className="text-[9px] text-white/20 text-center uppercase tracking-widest font-black italic">
             Catch the rocket before it crashes. Max x20.00
           </p>
        </div>

        {/* Win Overlay */}
        <AnimatePresence>
           {gameState === 'won' && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute inset-0 z-50 bg-brand-green flex flex-col items-center justify-center text-brand-bg text-center p-10"
             >
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-black font-display uppercase tracking-tighter italic leading-tight">Legendary<br/>Cashout!</h3>
                <div className="mt-4 text-4xl font-black">+{winAmount.toFixed(3)} TON</div>
                <button 
                  onClick={reset}
                  className="mt-8 px-8 py-3 bg-brand-bg text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Play Again
                </button>
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
