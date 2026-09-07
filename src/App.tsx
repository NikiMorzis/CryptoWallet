/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TasksView } from './components/TasksView';
import { WalletView } from './components/WalletView';
import { AdminPanel } from './components/AdminPanel';
import { useStore } from './store';

type View = 'tasks' | 'wallet' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('tasks');
  const adminMode = useStore((state) => state.adminMode);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex h-screen bg-theme-canvas text-theme-text overflow-hidden font-sans transition-colors duration-500 relative selection:bg-theme-accent/30">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden z-10 p-4 sm:p-8">
        {currentView === 'tasks' && <TasksView />}
        {currentView === 'wallet' && <WalletView />}
        {currentView === 'admin' && adminMode && <AdminPanel />}
      </main>
    </div>
  );
}
