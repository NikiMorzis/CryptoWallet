import React from 'react';
import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { ArrowDownRight, ArrowUpRight, CheckCircle2, CircleDollarSign, Clock, Wallet, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function WalletView() {
  const transactions = useStore((state) => state.transactions);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const adminMode = useStore((state) => state.adminMode);

  const balance = transactions.reduce((acc, tx) => {
    if (tx.type === 'deposit' || tx.type === 'task_payment') {
      return acc + tx.amount;
    }
    if (tx.type === 'withdrawal') {
      return acc - tx.amount;
    }
    return acc;
  }, 0);

  // Prepare chart data (reverse to chronological)
  const chartData = [...transactions].reverse().map(tx => ({
    name: format(parseISO(tx.date), 'dd MMM', { locale: ru }),
    value: tx.amount,
  }));

  return (
    <div className="p-2 max-w-6xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-theme-text mb-3 tracking-tight">Крипто-кошелек</h1>
        <p className="text-theme-muted text-lg font-medium">Управление вашими доходами и история всех транзакций.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-1 bg-theme-accent border border-theme-glass-border rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl shadow-theme-accent/20 text-theme-canvas flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 p-8 opacity-10 rotate-12">
            <Wallet size={240} />
          </div>
          
          <div className="relative z-10 mb-8">
            <div className="flex items-center gap-2 text-theme-canvas/80 mb-4 font-bold uppercase tracking-widest text-xs">
              <CircleDollarSign size={18} />
              Общий баланс
            </div>
            <div className="text-5xl font-black tracking-tighter">
              {formatCurrency(balance)}
            </div>
          </div>
          
          <div className="relative z-10 w-full mt-8">
             <button className="w-full bg-theme-canvas text-theme-text px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-xl">
                Вывод средств
             </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-theme-surface border border-theme-border rounded-[2.5rem] p-10 flex flex-col justify-center shadow-lg shadow-theme-shadow">
          <div className="flex justify-between items-center mb-8">
            <div className="text-theme-muted font-bold uppercase tracking-widest text-xs">Динамика баланса</div>
            <div className="flex items-center gap-2 text-xs font-bold text-theme-text bg-theme-canvas py-2 px-4 rounded-xl border border-theme-border shadow-sm">
              <CheckCircle2 size={16} className="text-theme-accent" /> Системы работают штатно
            </div>
          </div>
          
          <div className="h-56 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-theme-text mb-8">История транзакций</h3>
        
        <div className="bg-theme-surface border border-theme-border rounded-[2rem] overflow-hidden shadow-lg shadow-theme-shadow">
          {transactions.length === 0 ? (
            <div className="p-20 text-center text-theme-muted">
              <Clock size={56} className="mx-auto mb-6 opacity-30 text-theme-muted" />
              <p className="text-xl font-semibold">Пока нет транзакций.</p>
            </div>
          ) : (
            <div className="divide-y divide-theme-border">
              <AnimatePresence>
                {transactions.map((tx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={tx.id} 
                    className="p-6 sm:p-8 flex items-center justify-between hover:bg-theme-canvas/50 transition-colors group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm",
                        (tx.type === 'deposit' || tx.type === 'task_payment') 
                          ? "bg-theme-accent/10 text-theme-accent border-theme-accent/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {(tx.type === 'deposit' || tx.type === 'task_payment') ? <ArrowDownRight size={28} /> : <ArrowUpRight size={28} />}
                      </div>
                      <div>
                        <div className="font-bold text-theme-text text-xl mb-1 group-hover:text-theme-accent transition-colors">
                          {tx.type === 'task_payment' ? 'Оплата за задание' : tx.type === 'deposit' ? 'Пополнение' : 'Вывод средств'}
                        </div>
                        <div className="text-sm text-theme-muted font-bold tracking-wide uppercase">
                          {format(parseISO(tx.date), 'd MMMM yyyy • HH:mm', { locale: ru })}
                        </div>
                        {tx.description && (
                          <div className="text-base text-theme-text/70 mt-2 font-medium line-clamp-1 max-w-sm">{tx.description}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className={cn(
                        "font-black text-2xl",
                        (tx.type === 'deposit' || tx.type === 'task_payment') ? "text-theme-accent" : "text-red-500"
                      )}>
                        {(tx.type === 'deposit' || tx.type === 'task_payment') ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                      </div>
                      
                      {adminMode && (
                         <button 
                           onClick={() => deleteTransaction(tx.id)}
                           className="opacity-0 group-hover:opacity-100 p-3 text-theme-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                         >
                           <Trash2 size={24} />
                         </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
