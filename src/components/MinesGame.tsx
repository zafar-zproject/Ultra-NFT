import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bomb, Gem, X, Wallet, TrendingUp } from 'lucide-react';

interface MinesGameProps {
  balance: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onClose: () => void;
}

export default function MinesGame({ balance, onWin, onLose, onClose }: MinesGameProps) {
  const [bet, setBet] = useState(0.1);
  const [mineCount, setMineCount] = useState(3);
  const [grid, setGrid] = useState<(null | 'gem' | 'bomb')[]>(Array(16).fill(null));
  const [revealed, setRevealed] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'lost' | 'won'>('idle');
  const [mines, setMines] = useState<number[]>([]);

  const startLevel = () => {
    if (balance < bet) return;
    
    // Random mine positions
    const newMines: number[] = [];
    while (newMines.length < mineCount) {
      const pos = Math.floor(Math.random() * 16);
      if (!newMines.includes(pos)) newMines.push(pos);
    }
    
    setMines(newMines);
    setGrid(Array(16).fill(null));
    setRevealed([]);
    setGameState('playing');
  };

  const revealCell = (index: number) => {
    if (gameState !== 'playing' || revealed.includes(index)) return;

    if (mines.includes(index)) {
      setGameState('lost');
      setRevealed(Array.from({ length: 16 }, (_, i) => i)); // Reveal all
      onLose(bet);
    } else {
      const newRevealed = [...revealed, index];
      setRevealed(newRevealed);
      
      // If all gems found
      if (newRevealed.length === 16 - mineCount) {
        finishGame(newRevealed.length);
      }
    }
  };

  const getMultiplier = (count: number) => {
    if (count === 0) return 1;
    // Simple multiplier logic: more revealed cells = higher multiplier
    // Base formula roughly (total / safe) ^ revealed
    const multiplier = 1 + (count * 0.25 * (mineCount / 3));
    return multiplier;
  };

  const finishGame = (countOverride?: number) => {
    const count = countOverride !== undefined ? countOverride : revealed.length;
    const profit = bet * (getMultiplier(count) - 1);
    onWin(profit);
    setGameState('won');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative bg-brand-bg border border-white/10 rounded-[40px] w-full max-w-sm overflow-hidden flex flex-col shadow-2xl p-8 gap-6">
        <div className="flex items-center justify-between">
           <div className="flex flex-col">
              <h2 className="text-2xl font-black uppercase font-display italic tracking-tighter">Gem Mines</h2>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{mineCount} Mines Hidden</span>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
             <X className="w-4 h-4 text-white/40" />
           </button>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-4 gap-3">
          {grid.map((_, i) => (
            <motion.button 
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => revealCell(i)}
              className={`aspect-square rounded-[18px] border-2 transition-all flex items-center justify-center text-xl
                ${revealed.includes(i) 
                  ? (mines.includes(i) ? 'bg-red-500/20 border-red-500' : 'bg-brand-green/20 border-brand-green')
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
              `}
            >
              {revealed.includes(i) && (
                mines.includes(i) ? <Bomb className="w-6 h-6 text-red-500" /> : <Gem className="w-6 h-6 text-brand-green" />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
           <div className="flex justify-between items-end">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Multiplier</span>
                 <span className="text-2xl font-black font-display italic text-brand-green">{getMultiplier(revealed.length).toFixed(2)}x</span>
              </div>
              {gameState === 'playing' && revealed.length > 0 && (
                <button 
                  onClick={() => finishGame()}
                  className="bg-brand-green text-brand-bg px-6 py-2 rounded-xl font-black uppercase text-xs active:scale-95 transition-all shadow-[0_5px_15px_rgba(55,255,148,0.2)]"
                >
                  Cash Out +{(bet * (getMultiplier(revealed.length) - 1)).toFixed(3)}
                </button>
              )}
           </div>

           {gameState === 'idle' || gameState === 'lost' || gameState === 'won' ? (
              <div className="flex flex-col gap-4">
                 <div className="flex gap-2">
                    {[0.05, 0.1, 0.5, 1.0].map((val) => (
                      <button key={val} onClick={() => setBet(val)} className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${bet === val ? 'bg-brand-purple border-brand-purple' : 'bg-white/5 border-white/10'}`}>
                        {val} TON
                      </button>
                    ))}
                 </div>
                 <button onClick={startLevel} className="w-full h-14 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                   Start Game
                 </button>
              </div>
           ) : (
             <div className="py-4 text-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em] animate-pulse">
               Game in Progress...
             </div>
           )}
        </div>

        <AnimatePresence>
           {(gameState === 'won' || gameState === 'lost') && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`text-center font-black uppercase tracking-widest text-lg ${gameState === 'won' ? 'text-brand-green' : 'text-red-500'}`}
             >
                {gameState === 'won' ? 'Legendary Win!' : 'Mined! You Lost'}
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
