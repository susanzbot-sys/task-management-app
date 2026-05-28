import { createContext, useContext, useMemo, useState } from 'react';

const TaskContext = createContext(null);

const starterTasks = [
  {
    id: 1,
    title: 'Review onboarding checklist',
    description: 'Make sure new users can sign in and create their first task.',
    status: 'To Do',
    createdAt: '2026-03-16',
  },
  {
    id: 2,
    title: 'Set up CloudWatch dashboard',
    description: 'Track frontend availability and API latency for the AWS deployment study.',
    status: 'In Progress',
    createdAt: '2026-03-15',
  },
  {
    id: 3,
    title: 'Draft endpoint monitoring notes',
    description: 'Summarize the logs, alarms, and metrics needed for the proof of concept.',
    status: 'Done',
    createdAt: '2026-03-14',
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(starterTasks);
  const [filter, setFilter] = useState('All');

  const createTask = (taskInput) => {
    const newTask = {
      id: Date.now(),
      title: taskInput.title.trim(),
      description: taskInput.description.trim(),
      status: taskInput.status,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const metrics = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'To Do').length,
      inProgress: tasks.filter((task) => task.status === 'In Progress').length,
      done: tasks.filter((task) => task.status === 'Done').length,
    }),
    [tasks]
  );

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      filter,
      setFilter,
      createTask,
      updateTaskStatus,
      deleteTask,
      metrics,
    }),
    [tasks, filteredTasks, filter, metrics]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}
