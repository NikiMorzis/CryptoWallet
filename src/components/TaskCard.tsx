import React from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, Check, ChevronRight, Clock, Code2, DollarSign, Percent, MessageSquare } from 'lucide-react';

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const completeTask = useStore((state) => state.completeTask);

  const myShare = task.totalCost * (task.myPercentage / 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700 rounded-3xl p-7 flex flex-col transition-all duration-300 shadow-xl shadow-black/20 group"
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold rounded-lg border border-indigo-500/20 shadow-sm">
              {task.code}
            </span>
            {task.status === 'completed' && (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20 flex items-center gap-1 shadow-sm">
                <Check size={14} strokeWidth={3} /> Готово
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-zinc-100 line-clamp-1 group-hover:text-white transition-colors mb-1">{task.title}</h3>
          
          {task.clientContact && (
            <div className="flex items-center gap-1.5 text-sm text-zinc-400 mt-2">
              <MessageSquare size={14} className="text-indigo-400" />
              <span>{task.clientContact}</span>
            </div>
          )}
        </div>
        
        <div className="text-right shrink-0">
          <div className="text-sm text-zinc-400 mb-1 font-medium">Моя доля</div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {formatCurrency(myShare)}
          </div>
        </div>
      </div>

      <div className="bg-zinc-950/50 rounded-2xl p-5 mb-6 border border-zinc-800/60 flex-1 shadow-inner">
        <p className="text-sm text-zinc-300 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="mt-auto space-y-5">
        <div className="grid grid-cols-2 gap-4 text-sm bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/40">
          <div className="flex flex-col gap-1.5">
            <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><DollarSign size={14} className="text-indigo-400/70" /> Общий бюджет</span>
            <span className="font-semibold text-zinc-200">{formatCurrency(task.totalCost)}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><Percent size={14} className="text-indigo-400/70" /> Мой процент</span>
            <span className="font-semibold text-zinc-200">{task.myPercentage}%</span>
          </div>
          <div className="flex flex-col gap-1.5 col-span-2 mt-1">
            <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><Calendar size={14} className="text-indigo-400/70" /> Дедлайн</span>
            <span className="font-semibold text-zinc-200 flex items-center gap-2">
              {format(parseISO(task.deadline), 'd MMMM yyyy', { locale: ru })}
              {task.status === 'active' && (
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                  Осталось {Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} дн.
                </span>
              )}
            </span>
          </div>
        </div>

        {task.status === 'active' && (
          <button
            onClick={() => completeTask(task.id)}
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-500/50"
          >
            <Check size={18} strokeWidth={3} />
            Отметить как выполненное
          </button>
        )}
      </div>
    </motion.div>
  );
}
