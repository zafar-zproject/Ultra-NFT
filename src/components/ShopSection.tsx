import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Wallet, Box, X, TrendingUp } from 'lucide-react';
import { NFT } from '../types';

import tgCat from '@/src/assets/tg_cat.png';
import tgFrog from '@/src/assets/tg_frog.png';
import tgSkull from '@/src/assets/tg_skull.png';
import tgUnicorn from '@/src/assets/tg_unicorn.png';
import tgParrot from '@/src/assets/tg_parrot.png';
import tgLion from '@/src/assets/tg_lion.png';
import tgBear from '@/src/assets/tg_bear.png';
import tgRobot from '@/src/assets/tg_robot.png';
import tgPumpkin from '@/src/assets/tg_pumpkin.png';

const telegramNfts: NFT[] = [
  { id: 'cat', name: 'Mystic Cat', rarity: 'Legendary', image: tgCat, price: 2833.53 },
  { id: 'frog', name: 'Lucky Frog', rarity: 'Rare', image: tgFrog, price: 7315.20 },
  { id: 'skull', name: 'Crypto Skull', rarity: 'Epic', image: tgSkull, price: 5420.10 },
  { id: 'unicorn', name: 'Magic Unicorn', rarity: 'Legendary', image: tgUnicorn, price: 9200.00 },
  { id: 'parrot', name: 'Smart Parrot', rarity: 'Rare', image: tgParrot, price: 1200.50 },
  { id: 'lion', name: 'Royal Lion', rarity: 'Epic', image: tgLion, price: 4500.00 },
  { id: 'bear', name: 'Ice Bear', rarity: 'Common', image: tgBear, price: 500.20 },
  { id: 'robot', name: 'Cyber Robot', rarity: 'Rare', image: tgRobot, price: 2100.00 },
  { id: 'pumpkin', name: 'Spooky Pumpkin', rarity: 'Epic', image: tgPumpkin, price: 3300.00 },
];

interface ShopSectionProps {
  balance: number;
  onOpenBox: (cost: number) => boolean;
}

export default function ShopSection({ balance, onOpenBox }: ShopSectionProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<NFT | null>(null);
  const [showModal, setShowModal] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const boxPrice = 50.0;

  // Generate a long list of items for the roulette
  const rouletteItems = [...Array(40)].map((_, i) => telegramNfts[i % telegramNfts.length]);

  const handleStartSpin = async () => {
    if (isSpinning) return;
    
    // Check balance and subtract
    const success = onOpenBox(boxPrice);
    if (!success) {
      alert("Insufficient TON balance! Please top up.");
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    // Random winner from the end of the strip
    const winIndex = 30 + Math.floor(Math.random() * 5);
    const winningNFT = rouletteItems[winIndex];
    
    // Each card is ~120px wide
    const itemWidth = 136; // 120 (card) + 16 (gap)
    const targetOffset = winIndex * itemWidth - (containerRef.current?.offsetWidth || 0) / 2 + itemWidth / 2;

    await controls.start({
      x: -targetOffset,
      transition: { duration: 4, ease: [0.15, 0, 0.15, 1] }
    });

    setWinner(winningNFT);
    setIsSpinning(false);
    setTimeout(() => setShowModal(true), 500);
  };

  const handleReset = () => {
    setShowModal(false);
    controls.set({ x: 0 });
    setWinner(null);
  };

  return (
    <div className="flex flex-col gap-8 px-4 pb-32 pt-4">
      {/* VIP Box Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black uppercase font-display italic tracking-tighter">VIP Box</h2>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Premium Collection</span>
          </div>
          <div className="bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 rounded-full flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-brand-blue" />
            <span className="text-[10px] font-bold text-brand-blue uppercase">Price: 50.00 TON</span>
          </div>
        </div>

        {/* Roulette Drum */}
        <div className="relative h-48 w-full mt-4 flex items-center overflow-hidden rounded-[32px] bg-white/[0.02] border border-white/5 shadow-inner">
           {/* Center Markers */}
           <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] z-20">
              <div className="absolute top-0 left-0 right-0 h-8 bg-brand-purple shadow-[0_0_15px_#9D50FF]" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-brand-purple shadow-[0_0_15px_#9D50FF]" />
           </div>

           <motion.div 
             ref={containerRef}
             animate={controls}
             className="flex gap-4 px-[50%] items-center"
           >
             {rouletteItems.map((nft, i) => (
               <div 
                 key={i}
                 className={`w-30 h-36 flex-shrink-0 rounded-2xl border flex flex-col items-center justify-center p-2 transition-all relative overflow-hidden
                   ${winner && rouletteItems.indexOf(winner) === i ? 'bg-gradient-to-b from-brand-blue to-brand-blue/20 border-brand-blue' : 'bg-white/5 border-white/10 opacity-40'}
                 `}
               >
                 <img src={nft.image} alt={nft.name} className="w-20 h-20 object-contain drop-shadow-xl" />
                 <span className="text-[8px] font-black uppercase tracking-tight mt-2 text-white/60">{nft.rarity}</span>
               </div>
             ))}
           </motion.div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleStartSpin}
          disabled={isSpinning}
          className={`w-full h-16 rounded-[24px] flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 text-sm uppercase tracking-widest font-black
            ${isSpinning ? 'bg-white/5 text-white/20' : 'bg-brand-orange text-white shadow-[0_10px_30px_rgba(255,138,0,0.2)]'}
          `}
        >
          <Wallet className="w-5 h-5" />
          {isSpinning ? 'Opening...' : balance < boxPrice ? 'Insufficient Balance' : `Open Box - ${boxPrice.toFixed(2)} TON`}
        </button>
      </div>

      {/* Collections Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <Box className="w-4 h-4 text-white/50" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tight font-display">Collections in this Box</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {telegramNfts.map((nft) => (
             <div key={nft.id} className="bg-white/5 rounded-[32px] p-1 border border-white/5 flex flex-col items-center shadow-xl group">
                <div className="w-full aspect-square relative flex items-center justify-center p-4">
                   <div className="absolute inset-8 rounded-full bg-yellow-500/10 blur-2xl opacity-40" />
                   <div className="w-full h-full rounded-2xl border-2 border-yellow-500/30 bg-black/40 p-2 overflow-hidden">
                      <img src={nft.image} alt={nft.name} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                   </div>
                </div>
                <div className="w-full px-4 pb-4 flex flex-col items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{nft.rarity}</span>
                   <span className="text-xs font-black uppercase tracking-tighter truncate w-full text-center">{nft.name}</span>
                   <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-3 h-3 bg-brand-blue rotate-45 rounded-[0.5px]" />
                      <span className="text-sm font-black font-display tracking-tighter italic">{nft.price.toLocaleString()} TON</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {showModal && winner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleReset} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white/[0.05] border border-white/10 rounded-[40px] p-8 w-full max-w-sm flex flex-col items-center gap-6 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/20 to-transparent pointer-events-none" />
               <h2 className="text-2xl font-black font-display uppercase italic tracking-tighter">Congratulations!</h2>
               <div className="w-48 h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center relative shadow-2xl">
                  <div className="absolute inset-0 bg-brand-blue blur-3xl opacity-20" />
                  <img src={winner.image} alt={winner.name} className="w-32 h-32 object-contain relative z-10" />
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue mb-1">{winner.rarity}</span>
                  <span className="text-xl font-black uppercase tracking-tight">{winner.name}</span>
               </div>
               <button onClick={handleReset} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-3xl active:scale-95 transition-all text-sm shadow-xl">
                 Claim Reward
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
