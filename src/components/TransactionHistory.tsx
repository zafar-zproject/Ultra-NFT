import { motion } from 'motion/react';
import { History, X, ArrowUpRight, ArrowDownRight, ShoppingCart, Trophy, Ghost } from 'lucide-react';
import { TransactionRecord } from '../lib/firebase';

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
  onClose: () => void;
}

export default function TransactionHistory({ transactions, onClose }: TransactionHistoryProps) {
  const getIcon = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'win': return <Trophy className="w-4 h-4 text-brand-green" />;
      case 'loss': return <Ghost className="w-4 h-4 text-red-500" />;
      case 'deposit': return <ArrowDownRight className="w-4 h-4 text-brand-blue" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-brand-orange" />;
      case 'purchase': return <ShoppingCart className="w-4 h-4 text-brand-purple" />;
      default: return <History className="w-4 h-4 text-white/40" />;
    }
  };

  const getAmountColor = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'win':
      case 'deposit': 
        return 'text-brand-green';
      case 'loss':
      case 'withdrawal':
      case 'purchase':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  const formatAmount = (amount: number, type: TransactionRecord['type']) => {
    const prefix = (type === 'win' || type === 'deposit') ? '+' : '-';
    return `${prefix}${Math.abs(amount).toFixed(3)} TON`;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="relative bg-brand-bg border-t border-x border-white/10 rounded-t-[40px] w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl"
      >
        <div className="p-6 pb-2 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                 <History className="w-5 h-5 text-brand-purple" />
              </div>
              <h2 className="text-xl font-black uppercase font-display italic tracking-tighter">History</h2>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
             <X className="w-4 h-4 text-white/40" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar flex flex-col gap-3">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
               <History className="w-12 h-12" />
               <p className="text-xs font-black uppercase tracking-widest italic">No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center">
                       {getIcon(tx.type)}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{tx.description}</span>
                       <span className="text-[9px] font-medium text-white/20">
                          {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleString() : 'Just now'}
                       </span>
                    </div>
                 </div>
                 <div className={`text-xs font-black italic ${getAmountColor(tx.type)}`}>
                    {formatAmount(tx.amount, tx.type)}
                 </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 pt-2">
           <div className="h-1 w-12 bg-white/10 rounded-full mx-auto" />
        </div>
      </motion.div>
    </div>
  );
}
