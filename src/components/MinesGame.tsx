import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bomb, Gem, X, Wallet, Settings, LayoutGrid } from 'lucide-react';

interface MinesGameProps {
  balance: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onClose: () => void;
}

export default function MinesGame({ balance, onWin, onLose, onClose }: MinesGameProps) {
  const [bet, setBet] = useState(0.1);
  const [betInput, setBetInput] = useState('0.1');
  const [gridSize, setGridSize] = useState(4); // 4, 6, 8, 10
  const [mineCount, setMineCount] = useState(3);
  const [grid, setGrid] = useState<(null | 'gem' | 'bomb')[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'lost' | 'won'>('idle');
  const [mines, setMines] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const totalCells = useMemo(() => gridSize * gridSize, [gridSize]);

  useEffect(() => {
    if (gameState === 'idle') {
      setGrid(Array(totalCells).fill(null));
      setRevealed([]);
    }
  }, [gridSize, totalCells, gameState]);

  const startLevel = () => {
    const finalBet = parseFloat(betInput);
    if (balance < finalBet || isNaN(finalBet) || finalBet <= 0) {
      alert("Invalid bet or insufficient balance!");
      return;
    }
    
    setBet(finalBet);
    
    const newMines: number[] = [];
    while (newMines.length < Math.min(mineCount, totalCells - 1)) {
      const pos = Math.floor(Math.random() * totalCells);
      if (!newMines.includes(pos)) newMines.push(pos);
    }
    
    setMines(newMines);
    setGrid(Array(totalCells).fill(null));
    setRevealed([]);
    setGameState('playing');
    setShowSettings(false);
  };

  const revealCell = (index: number) => {
    if (gameState !== 'playing' || revealed.includes(index)) return;

    if (mines.includes(index)) {
      setGameState('lost');
      setRevealed(Array.from({ length: totalCells }, (_, i) => i));
      onLose(bet);
    } else {
      const newRevealed = [...revealed, index];
      setRevealed(newRevealed);
      
      if (newRevealed.length === totalCells - mines.length) {
        finishGame(newRevealed.length);
      }
    }
  };

  const getMultiplier = (revealedCount: number) => {
    if (revealedCount === 0) return 1;
    let multiplier = 1;
    for (let i = 0; i < revealedCount; i++) {
        multiplier *= (totalCells - i) / (totalCells - mines.length - i);
    }
    return multiplier * 0.99;
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
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        className="relative bg-brand-bg border border-white/10 rounded-[40px] w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col shadow-2xl p-6 lg:p-8 gap-4"
      >
        <div className="flex items-center justify-between flex-shrink-0">
           <div className="flex flex-col text-left">
              <h2 className="text-2xl font-black uppercase font-display italic tracking-tighter">Gem Mines</h2>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{gridSize}x{gridSize} • {mineCount} Mines</span>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
               <Settings className={`w-4 h-4 text-white/40 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
             </button>
             <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
               <X className="w-4 h-4 text-white/40" />
             </button>
           </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 flex flex-col gap-5 hide-scrollbar">
          {showSettings && gameState === 'idle' && (
             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-col gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 flex-shrink-0">
                <div className="flex flex-col gap-2 text-left">
                   <span className="text-[10px] font-black text-white/30 uppercase">Grid Size</span>
                   <div className="flex gap-2">
                      {[4, 6, 8, 10].map(s => (
                        <button key={s} onClick={() => { setGridSize(s); setMineCount(Math.min(mineCount, s*s-1)); }} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${gridSize === s ? 'bg-brand-purple border-brand-purple' : 'bg-white/5 border-white/10'}`}>
                          {s}x{s}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex flex-col gap-2 text-left">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/30 uppercase">Mines</span>
                      <span className="text-[10px] font-black text-brand-purple uppercase">{mineCount}</span>
                   </div>
                   <input 
                     type="range" min="1" max={totalCells - 1} value={mineCount} 
                     onChange={(e) => setMineCount(parseInt(e.target.value))}
                     className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                   />
                </div>
             </motion.div>
          )}

          <div 
            className="grid gap-1.5 mx-auto w-full flex-shrink-0"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {Array(totalCells).fill(null).map((_, i) => (
              <motion.button 
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => revealCell(i)}
                className={`aspect-square rounded-md border transition-all flex items-center justify-center p-1
                  ${revealed.includes(i) 
                    ? (mines.includes(i) ? 'bg-red-500/20 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-brand-green/20 border-brand-green shadow-[inset_0_0_8px_rgba(55,255,148,0.2)]')
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }
                `}
              >
                {revealed.includes(i) && (
                  mines.includes(i) ? <Bomb className="w-full h-full text-red-500" /> : <Gem className="w-full h-full text-brand-green" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-auto flex-shrink-0">
             <div className="flex justify-between items-end">
                <div className="flex flex-col text-left">
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Multiplier</span>
                   <span className="text-2xl font-black font-display italic text-brand-green leading-none">{getMultiplier(revealed.length).toFixed(2)}x</span>
                </div>
                {gameState === 'playing' && revealed.length > 0 && (
                  <button 
                    onClick={() => finishGame()}
                    className="bg-brand-green text-brand-bg px-5 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-[0_5px_15px_rgba(55,255,148,0.2)]"
                  >
                    Cash Out +{(bet * (getMultiplier(revealed.length) - 1)).toFixed(3)}
                  </button>
                )}
             </div>

             {gameState === 'idle' || gameState === 'lost' || gameState === 'won' ? (
                <div className="flex flex-col gap-3">
                   <div className="flex flex-col gap-1.5 text-left">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Bet Amount</span>
                      <div className="flex gap-2">
                         <input 
                           type="number" value={betInput} onChange={(e) => setBetInput(e.target.value)}
                           className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-brand-purple transition-all"
                           placeholder="0.00"
                         />
                         <button onClick={() => setBetInput((parseFloat(betInput) * 2 || 0).toString())} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase">x2</button>
                      </div>
                   </div>
                   <button onClick={startLevel} className="w-full h-14 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all text-xs">
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
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`text-center font-black uppercase tracking-widest text-lg leading-none py-2 ${gameState === 'won' ? 'text-brand-green' : 'text-red-500'}`}
               >
                  {gameState === 'won' ? 'Legendary Win!' : 'Mined! You Lost'}
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
