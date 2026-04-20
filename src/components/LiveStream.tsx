import { LiveDrop } from '../types';

const mockDrops: LiveDrop[] = [
  { id: '1', user: 'Alex', itemIcon: '🐱', rarity: 'Legendary', caseName: 'VIP Box' },
  { id: '2', user: 'Dmitry', itemIcon: '🐸', rarity: 'Rare', caseName: 'Standard' },
  { id: '3', user: 'Ivan', itemIcon: '💀', rarity: 'Epic', caseName: 'VIP Box' },
  { id: '4', user: 'Sasha', itemIcon: '🦄', rarity: 'Legendary', caseName: 'Royal' },
  { id: '5', user: 'Elena', itemIcon: '🐻', rarity: 'Common', caseName: 'Standard' },
  { id: '6', user: 'Mikhail', itemIcon: '🦁', rarity: 'Epic', caseName: 'VIP Box' },
];

const rarityColors = {
  Common: 'bg-white/10',
  Rare: 'bg-brand-blue/20 shadow-[0_0_10px_rgba(0,163,255,0.3)]',
  Epic: 'bg-brand-purple/20 shadow-[0_0_10px_rgba(157,80,255,0.3)]',
  Legendary: 'bg-brand-orange/20 shadow-[0_0_10px_rgba(255,138,0,0.3)]',
};

export default function LiveStream() {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse shadow-[0_0_8px_rgba(55,255,148,0.6)]" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Global Rewards</span>
        </div>
        <span className="text-[10px] font-black text-brand-purple uppercase cursor-pointer hover:text-brand-purple/80 transition-colors">Stats</span>
      </div>
      
      <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 py-1">
        {mockDrops.map((drop) => (
          <div 
            key={drop.id} 
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-[20px] border border-white/5 backdrop-blur-sm ${rarityColors[drop.rarity]} transition-transform active:scale-95`}
          >
            <span className="text-xl drop-shadow-lg">{drop.itemIcon}</span>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-white/90 leading-tight truncate max-w-[60px]">{drop.user}</span>
               <span className="text-[7px] font-black text-white/40 leading-none uppercase tracking-widest">{drop.rarity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
