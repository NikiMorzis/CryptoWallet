import React, { useState } from 'react';
import { useStore } from '../store';
import { Task, TransactionType } from '../types';
import { Plus, Edit2, Trash2, Save, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminPanel() {
  const { tasks, addTask, updateTask, deleteTask, addTransaction } = useStore();
  const [activeTab, setActiveTab] = useState<'tasks' | 'wallet'>('tasks');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="p-2 max-w-6xl mx-auto w-full">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-accent/10 text-theme-accent text-xs font-bold uppercase tracking-widest mb-6 border border-theme-accent/20 shadow-sm">
          <AlertCircle size={16} strokeWidth={2.5} /> Скрытая панель администратора
        </div>
        <h1 className="text-4xl font-black text-theme-text mb-3 tracking-tight">Управление системой</h1>
        <p className="text-theme-muted text-lg font-medium">Скрытое добавление заданий и управление транзакциями кошелька.</p>
      </div>

      <div className="flex gap-6 mb-10 border-b border-theme-border pb-px">
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            "px-2 py-3 font-bold uppercase tracking-wider text-sm border-b-2 transition-colors",
            activeTab === 'tasks' ? "border-theme-accent text-theme-accent" : "border-transparent text-theme-muted hover:text-theme-text"
          )}
        >
          Управление заданиями
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={cn(
            "px-2 py-3 font-bold uppercase tracking-wider text-sm border-b-2 transition-colors",
            activeTab === 'wallet' ? "border-theme-accent text-theme-accent" : "border-transparent text-theme-muted hover:text-theme-text"
          )}
        >
          Управление кошельком
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <TaskForm 
              initialData={editingTask} 
              onSubmit={(data) => {
                if (editingTask) {
                  updateTask(editingTask.id, data);
                  setEditingTask(null);
                } else {
                  addTask(data as any);
                }
              }} 
              onCancel={editingTask ? () => setEditingTask(null) : undefined}
            />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-theme-text mb-6">Все задания в системе</h3>
            {tasks.map(task => (
              <div key={task.id} className="bg-theme-surface border border-theme-border p-6 rounded-3xl flex items-center justify-between group hover:border-theme-accent/50 transition-colors shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold text-theme-accent bg-theme-accent/10 px-3 py-1 rounded-lg border border-theme-accent/20">{task.code}</span>
                    <span className={cn("text-xs font-bold px-3 py-1 rounded-lg border", task.status === 'active' ? 'bg-theme-accent/10 text-theme-accent border-theme-accent/20' : 'bg-theme-canvas text-theme-muted border-theme-border')}>
                      {task.status === 'active' ? 'Активное' : 'Выполнено'}
                    </span>
                  </div>
                  <div className="font-bold text-theme-text text-xl group-hover:text-theme-accent transition-colors">{task.title}</div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => setEditingTask(task)} className="p-3 text-theme-muted hover:text-theme-text hover:bg-theme-canvas rounded-2xl transition-colors shadow-sm border border-transparent hover:border-theme-border">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="p-3 text-theme-muted hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors shadow-sm border border-transparent hover:border-red-500/20">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <div className="text-theme-muted text-lg font-medium p-8 bg-theme-canvas rounded-[2rem] border-2 border-theme-border border-dashed text-center">В системе нет заданий.</div>}
          </div>
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="max-w-xl">
          <div className="bg-theme-surface border border-theme-border p-10 rounded-[2.5rem] shadow-xl shadow-theme-shadow">
            <h3 className="text-2xl font-bold text-theme-text mb-8">Добавить транзакцию</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addTransaction({
                type: formData.get('type') as TransactionType,
                amount: Number(formData.get('amount')),
                currency: 'USDT',
                description: formData.get('description') as string,
              });
              e.currentTarget.reset();
            }} className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Тип транзакции</label>
                <select name="type" required className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all">
                  <option value="deposit">Пополнение (Deposit)</option>
                  <option value="withdrawal">Вывод (Withdrawal)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Сумма (USDT)</label>
                <input type="number" name="amount" required min="0" step="0.01" className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Описание (опционально)</label>
                <input type="text" name="description" required className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all" />
              </div>

              <button type="submit" className="w-full bg-theme-accent hover:bg-theme-accent-hover text-white font-bold py-4 rounded-2xl transition-all mt-4 shadow-lg shadow-theme-accent/30 text-lg">
                Выполнить транзакцию
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskForm({ initialData, onSubmit, onCancel }: { 
  initialData?: Task | null, 
  onSubmit: (data: any) => void,
  onCancel?: () => void 
}) {
  return (
    <div className="bg-theme-surface border border-theme-border p-8 rounded-[2.5rem] shadow-xl shadow-theme-shadow">
      <h3 className="text-2xl font-bold text-theme-text mb-8">
        {initialData ? 'Редактировать задание' : 'Создать новое задание'}
      </h3>
      <form 
        key={initialData?.id || 'new'}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit({
            title: formData.get('title'),
            description: formData.get('description'),
            deadline: formData.get('deadline'),
            totalCost: Number(formData.get('totalCost')),
            myPercentage: Number(formData.get('myPercentage')),
            clientContact: formData.get('clientContact') as string,
            ...(initialData ? { status: formData.get('status') } : {})
          });
          if (!initialData) e.currentTarget.reset();
        }} 
        className="space-y-6"
      >
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Название</label>
          <input defaultValue={initialData?.title} type="text" name="title" required className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Техническое задание (ТЗ)</label>
          <textarea defaultValue={initialData?.description} name="description" required rows={4} className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all resize-none"></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Связь с заказчиком</label>
          <input defaultValue={initialData?.clientContact} type="text" name="clientContact" placeholder="@username или email" className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all placeholder:text-theme-muted/50" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Дедлайн</label>
          <input defaultValue={initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : ''} type="date" name="deadline" required className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Общий бюджет ($)</label>
            <input defaultValue={initialData?.totalCost} type="number" name="totalCost" required min="0" className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Моя доля (%)</label>
            <input defaultValue={initialData?.myPercentage || 30} type="number" name="myPercentage" required min="0" max="100" className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all" />
          </div>
        </div>

        {initialData && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Статус</label>
            <select defaultValue={initialData.status} name="status" className="w-full bg-theme-canvas border border-theme-border rounded-2xl px-5 py-4 text-theme-text font-medium focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all">
              <option value="active">Активное</option>
              <option value="completed">Выполнено</option>
            </select>
          </div>
        )}

        <div className="pt-6 flex flex-col gap-3">
          <button type="submit" className="w-full bg-theme-accent hover:bg-theme-accent-hover text-white font-bold py-4 rounded-2xl transition-all duration-300 flex justify-center items-center gap-2 shadow-lg shadow-theme-accent/30 text-lg">
            {initialData ? <><Save size={20}/> Сохранить</> : <><Plus size={20}/> Создать</>}
          </button>
          {initialData && (
            <button type="button" onClick={onCancel} className="w-full bg-theme-canvas hover:bg-theme-border text-theme-text font-bold py-4 rounded-2xl transition-all">
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
