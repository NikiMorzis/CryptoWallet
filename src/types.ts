export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  totalCost: number;
  myPercentage: number;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  clientContact?: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'task_payment';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string; // ISO date string
  description?: string;
  taskId?: string; // If related to a task
}

export type ThemeType = 'light' | 'dark' | 'sage' | 'midnight' | 'latte';

export interface AppState {
  tasks: Task[];
  transactions: Transaction[];
  adminMode: boolean;
  theme: ThemeType;
  
  // Actions
  toggleAdminMode: () => void;
  setTheme: (theme: ThemeType) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'code' | 'createdAt' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Wallet Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
}
