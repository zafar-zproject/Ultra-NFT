import { Rocket, Trophy, Flame } from 'lucide-react';

export default function BannerCards() {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-2">
      {/* Big Win Banner */}
      <div className="bg-gradient-to-br from-brand-purple/40 to-brand-purple rounded-[32px] p-5 relative overflow-hidden h-44 flex flex-col justify-between shadow-[0_20px_40px_rgba(139,92,246,0.2)] border border-white/10 group active:scale-95 transition-all">
        <div className="absolute -top-6 -right-6 opacity-30 group-hover:scale-125 transition-transform duration-700">
          <Trophy className="w-28 h-28 italic rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-1">
            <Flame className="w-3 h-3 text-brand-orange animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Big Win</span>
          </div>
          <h3 className="text-2xl font-black font-display tracking-tighter leading-tight italic uppercase">Royal<br/>Drop</h3>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
             <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-black uppercase tracking-tight">x1000</span>
        </div>
      </div>

      {/* Special Event Banner */}
      <div className="bg-gradient-to-br from-brand-blue/40 to-brand-blue rounded-[32px] p-5 relative overflow-hidden h-44 flex flex-col justify-between shadow-[0_20px_40px_rgba(14,165,233,0.2)] border border-white/10 group active:scale-95 transition-all">
        <div className="absolute -top-4 -right-4 opacity-30 group-hover:-translate-y-2 transition-transform duration-700">
          <Rocket className="w-28 h-28 -rotate-12" />
        </div>

        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Flash Event</span>
          <h3 className="text-2xl font-black font-display tracking-tighter leading-tight italic uppercase">Fast<br/>Rocket</h3>
        </div>

        <div className="flex -space-x-2 relative z-10">
           {[1,2,3].map((i) => (
             <img 
               key={i}
               src={`https://picsum.photos/seed/winner${i}/60/60`} 
               className="w-8 h-8 rounded-full border-2 border-brand-blue object-cover shadow-lg"
               referrerPolicy="no-referrer"
               alt="User"
             />
           ))}
           <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border-2 border-brand-blue flex items-center justify-center text-[8px] font-black">
             +54
           </div>
        </div>
      </div>
    </div>
  );
}
