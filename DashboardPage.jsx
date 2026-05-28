import MetricCard from '../components/MetricCard';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../context/TaskContext';

export default function DashboardPage() {
  const { metrics } = useTasks();

  return (
    <>
      <section className="metrics-grid">
        <MetricCard label="Total Tasks" value={metrics.total} />
        <MetricCard label="To Do" value={metrics.todo} />
        <MetricCard label="In Progress" value={metrics.inProgress} />
        <MetricCard label="Done" value={metrics.done} />
      </section>

      <section className="dashboard-grid">
        <TaskForm />
        <TaskList />
      </section>
    </>
  );
}
