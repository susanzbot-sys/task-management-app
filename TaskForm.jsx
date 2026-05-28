import { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const initialForm = {
  title: '',
  description: '',
  status: 'To Do',
};

export default function TaskForm() {
  const { createTask } = useTasks();
  const [form, setForm] = useState(initialForm);

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    createTask(form);
    setForm(initialForm);
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Create task</h2>
        <p>Add a new task for your workspace.</p>
      </div>

      <form className="form-stack" onSubmit={submit}>
        <label>
          <span>Title</span>
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Prepare weekly deployment review"
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Add notes or context for this task."
          />
        </label>

        <label>
          <span>Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </label>

        <button className="primary-button" type="submit">Create task</button>
      </form>
    </section>
  );
}
