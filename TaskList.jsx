import { useTasks } from '../context/TaskContext';
import StatusBadge from './StatusBadge';

export default function TaskList() {
  const { filteredTasks, filter, setFilter, updateTaskStatus, deleteTask } = useTasks();

  return (
    <section className="panel">
      <div className="panel-header panel-header-row">
        <div>
          <h2>Your tasks</h2>
          <p>View and manage tasks by current status.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">No tasks in this view yet.</div>
        ) : (
          filteredTasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-card-main">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <StatusBadge status={task.status} />
                </div>
                <p>{task.description || 'No description provided.'}</p>
                <small>Created: {task.createdAt}</small>
              </div>

              <div className="task-actions">
                <button onClick={() => updateTaskStatus(task.id, 'To Do')}>To Do</button>
                <button onClick={() => updateTaskStatus(task.id, 'In Progress')}>In Progress</button>
                <button onClick={() => updateTaskStatus(task.id, 'Done')}>Done</button>
                <button className="danger-button" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
