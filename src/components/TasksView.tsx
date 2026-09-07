import React, { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { TaskCard } from './TaskCard';
import { CheckCircle2, CircleDashed, Trophy, Filter } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { isAfter, subDays, subMonths, subYears, parseISO } from 'date-fns';

type TimeFilter = 'all' | 'week' | 'month' | 'year';

export function TasksView() {
  const tasks = useStore((state) => state.tasks);
  const transactions = useStore((state) => state.transactions);
  
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const totalEarningsAllTime = transactions
    .filter(tx => tx.type === 'task_payment')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const filteredTasks = tasks.filter((t) => {
    if (t.status !== activeTab) return false;
    
    if (activeTab === 'completed' && t.completedAt && timeFilter !== 'all') {
      const completedDate = parseISO(t.completedAt);
      const now = new Date();
      if (timeFilter === 'week' && !isAfter(completedDate, subDays(now, 7))) return false;
      if (timeFilter === 'month' && !isAfter(completedDate, subMonths(now, 1))) return false;
      if (timeFilter === 'year' && !isAfter(completedDate, subYears(now, 1))) return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto w-full p-2">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-theme-text mb-3 tracking-tight">Задания</h1>
          <p className="text-theme-muted text-lg font-medium">Управление назначенными проектами и отслеживание статусов.</p>
        </div>

        <div className="flex bg-theme-glass backdrop-blur-xl p-1.5 rounded-2xl border border-theme-border shadow-sm">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === 'active'
                ? "bg-theme-surface text-theme-text shadow-sm border border-theme-border"
                : "text-theme-muted hover:text-theme-text"
            )}
          >
            <CircleDashed size={18} className={activeTab === 'active' ? 'text-theme-accent' : ''} />
            Активные
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === 'completed'
                ? "bg-theme-surface text-theme-text shadow-sm border border-theme-border"
                : "text-theme-muted hover:text-theme-text"
            )}
          >
            <CheckCircle2 size={18} className={activeTab === 'completed' ? 'text-theme-accent' : ''} />
            Выполненные
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-10"
          >
            <div className="bg-theme-surface border border-theme-border rounded-[2rem] p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-theme-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-theme-text">
                <Trophy size={200} />
              </div>
              
              <div className="relative z-10">
                <div className="text-theme-muted font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                  <Trophy size={16} className="text-theme-accent" />
                  Заработано за всё время
                </div>
                <div className="text-5xl sm:text-6xl font-black text-theme-accent tracking-tight">
                  {formatCurrency(totalEarningsAllTime)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
                <div className="text-sm font-bold text-theme-muted flex items-center gap-2 bg-theme-canvas/50 px-5 py-3 rounded-2xl border border-theme-border">
                  <Filter size={16} /> Период:
                </div>
                <div className="flex bg-theme-canvas/50 p-1.5 rounded-2xl border border-theme-border shadow-inner w-full sm:w-auto">
                  {(['all', 'week', 'month', 'year'] as TimeFilter[]).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={cn(
                        "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 capitalize",
                        timeFilter === filter
                          ? "bg-theme-surface text-theme-accent shadow-sm border border-theme-border"
                          : "text-theme-muted hover:text-theme-text"
                      )}
                    >
                      {filter === 'all' ? 'Всё время' : filter === 'week' ? 'Неделя' : filter === 'month' ? 'Месяц' : 'Год'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-32 flex flex-col items-center justify-center text-theme-muted bg-theme-surface/50 backdrop-blur-sm border-2 border-theme-border rounded-[3rem] border-dashed shadow-sm"
            >
              <div className="p-6 bg-theme-canvas rounded-3xl mb-6 shadow-inner border border-theme-border">
                {activeTab === 'active' ? <CircleDashed size={48} className="text-theme-muted/50" /> : <CheckCircle2 size={48} className="text-theme-muted/50" />}
              </div>
              <p className="text-xl font-semibold text-theme-muted">Нет {activeTab === 'active' ? 'активных' : 'выполненных'} заданий.</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
