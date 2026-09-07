import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Task, Transaction } from './types';
import { generateTaskCode } from './lib/utils';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: '1',
          code: 'TSK-A7X9F2',
          title: 'Редизайн интернет-магазина одежды',
          description: 'Полный редизайн главной витрины, карточек товаров и корзины. Требуется высокая производительность и адаптивность под мобильные устройства (Mobile-first). Стек: Next.js, Tailwind, Stripe.',
          deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
          totalCost: 12500,
          myPercentage: 60,
          status: 'active',
          createdAt: new Date().toISOString(),
          clientContact: '@fashion_ceo',
        },
        {
          id: '2',
          code: 'TSK-B3M8P1',
          title: 'Лендинг для AI-стартапа',
          description: 'Высококонверсионная посадочная страница для нового ИИ стартапа. Нужна темная тема, плавные скролл-анимации и интеграция формы с Mailchimp.',
          deadline: new Date(Date.now() - 86400000 * 2).toISOString(),
          totalCost: 3200,
          myPercentage: 100,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          clientContact: 'founder@ai-startup.io',
        }
      ],
      transactions: [
        {
          id: 'tx1',
          type: 'task_payment',
          amount: 3200,
          currency: 'USDT',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          description: 'Оплата за задание TSK-B3M8P1: Лендинг для AI-стартапа',
          taskId: '2',
        },
        {
          id: 'tx2',
          type: 'deposit',
          amount: 500,
          currency: 'USDT',
          date: new Date(Date.now() - 86400000 * 15).toISOString(),
          description: 'Начальное пополнение баланса',
        }
      ],
      adminMode: false,
      theme: 'sage',

      toggleAdminMode: () => set((state) => ({ adminMode: !state.adminMode })),
      setTheme: (theme) => set({ theme }),

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          code: generateTaskCode(),
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      completeTask: (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);
        
        if (task && task.status === 'active') {
          const completedAt = new Date().toISOString();
          const paymentAmount = task.totalCost * (task.myPercentage / 100);
          
          // Complete the task
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, status: 'completed', completedAt } : t
            ),
          }));

          // Add a task payment transaction automatically
          get().addTransaction({
            type: 'task_payment',
            amount: paymentAmount,
            currency: 'USDT',
            description: `Payment for task ${task.code}: ${task.title}`,
            taskId: task.id,
          });
        }
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id === id),
        }));
      },

      addTransaction: (txData) => {
        const newTx: Transaction = {
          ...txData,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
      },
    }),
    {
      name: 'devspace-storage',
    }
  )
);
