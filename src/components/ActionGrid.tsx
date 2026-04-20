import { FileText, ArrowUpCircle } from 'lucide-react';

export default function ActionGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-4">
      <button className="bg-brand-purple/10 border border-brand-purple/20 h-14 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 group">
        <div className="w-8 h-8 rounded-xl bg-brand-purple/20 flex items-center justify-center group-hover:bg-brand-purple/30">
          <FileText className="w-4 h-4 text-brand-purple" />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest text-brand-purple">Contracts</span>
      </button>

      <button className="bg-brand-green/10 border border-brand-green/20 h-14 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 group">
        <div className="w-8 h-8 rounded-xl bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30">
          <ArrowUpCircle className="w-4 h-4 text-brand-green" />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest text-brand-green">Upgrade</span>
      </button>
    </div>
  );
}
