import React, { useEffect } from 'react';
import { Briefcase, Wallet, Settings, ShieldAlert, Cpu, Palette } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ThemeType } from '../types';

interface SidebarProps {
  currentView: 'tasks' | 'wallet' | 'admin';
  setCurrentView: (view: 'tasks' | 'wallet' | 'admin') => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { adminMode, toggleAdminMode, theme, setTheme } = useStore();

  const themes: { id: ThemeType; name: string; color: string }[] = [
    { id: 'light', name: 'Светлая', color: '#f8fafc' },
    { id: 'dark', name: 'Темная', color: '#09090b' },
    { id: 'sage', name: 'Мята', color: '#f0f2eb' },
    { id: 'midnight', name: 'Полночь', color: '#0b1121' },
    { id: 'latte', name: 'Латте', color: '#faf6f0' },
  ];

  // Hidden admin toggle: Ctrl + Shift + A (just as a backup)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        toggleAdminMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAdminMode]);

  return (
    <aside className="w-72 bg-theme-glass backdrop-blur-2xl border-r border-theme-border flex flex-col justify-between shrink-0 z-20 transition-colors duration-500 shadow-xl shadow-theme-shadow">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-theme-accent/10 rounded-2xl border border-theme-accent/20 text-theme-accent shadow-sm">
            <Cpu size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-theme-text">DevSpace</span>
        </div>

        <nav className="space-y-3">
          <button
            onClick={() => setCurrentView('tasks')}
            className={cn(
              "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 text-sm font-semibold relative group",
              currentView === 'tasks'
                ? "bg-theme-accent/10 text-theme-accent shadow-sm border border-theme-accent/10"
                : "text-theme-muted hover:bg-theme-hover hover:text-theme-text border border-transparent"
            )}
          >
            {currentView === 'tasks' && (
              <motion.div layoutId="active-nav" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-theme-accent rounded-r-full shadow-sm" />
            )}
            <Briefcase size={20} className="group-hover:scale-110 transition-transform duration-300" />
            Мои задания
          </button>
          
          <button
            onClick={() => setCurrentView('wallet')}
            className={cn(
              "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 text-sm font-semibold relative group",
              currentView === 'wallet'
                ? "bg-theme-accent/10 text-theme-accent shadow-sm border border-theme-accent/10"
                : "text-theme-muted hover:bg-theme-hover hover:text-theme-text border border-transparent"
            )}
          >
            {currentView === 'wallet' && (
              <motion.div layoutId="active-nav" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-theme-accent rounded-r-full shadow-sm" />
            )}
            <Wallet size={20} className="group-hover:scale-110 transition-transform duration-300" />
            Крипто-кошелек
          </button>

          {adminMode && (
            <motion.button
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onClick={() => setCurrentView('admin')}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 text-sm font-semibold relative group",
                currentView === 'admin'
                  ? "bg-theme-accent/10 text-theme-accent shadow-sm border border-theme-accent/10"
                  : "text-theme-muted hover:bg-theme-hover hover:text-theme-text border border-transparent"
              )}
            >
              {currentView === 'admin' && (
                <motion.div layoutId="active-nav" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-theme-accent rounded-r-full shadow-sm" />
              )}
              <ShieldAlert size={20} className="group-hover:scale-110 transition-transform duration-300" />
              Панель управления
            </motion.button>
          )}
        </nav>
      </div>

      <div className="p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-theme-muted uppercase tracking-wider mb-4">
            <Palette size={14} /> Тема оформления
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.name}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-transform duration-300 shadow-sm",
                  theme === t.id ? "scale-125 border-theme-accent ring-2 ring-theme-accent/20" : "border-theme-border hover:scale-110"
                )}
                style={{ backgroundColor: t.color }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={toggleAdminMode}
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-theme-muted hover:bg-theme-hover hover:text-theme-text transition-colors text-sm font-semibold border border-transparent hover:border-theme-border"
        >
          <Settings size={18} />
          {adminMode ? 'Скрыть панель' : 'Настройки'}
        </button>
      </div>
    </aside>
  );
}
