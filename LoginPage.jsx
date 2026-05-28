import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, demoCredentials } = useAuth();
  const [form, setForm] = useState(demoCredentials);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const result = login(form.email, form.password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setError('');
    navigate('/dashboard');
  };

  return (
    <div className="auth-layout">
      <section className="hero-card">
        <div className="hero-badge">Sample AWS Study App</div>
        <h1>TaskFlow</h1>
        <p>
          A simple React task management app for AWS hosting, deployment, security, and monitoring studies.
        </p>

        <div className="hero-grid">
          <div>
            <span>Flow 1</span>
            <strong>User login</strong>
          </div>
          <div>
            <span>Flow 2</span>
            <strong>Create tasks</strong>
          </div>
          <div>
            <span>Flow 3</span>
            <strong>View tasks</strong>
          </div>
        </div>
      </section>

      <section className="login-card">
        <h2>Sign in</h2>
        <p>Use the demo credentials to explore the app.</p>

        <form className="form-stack" onSubmit={submit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </label>

          {error ? <div className="error-box">{error}</div> : null}

          <button className="primary-button" type="submit">Log in</button>
        </form>

        <div className="demo-box">
          <div><strong>Demo email:</strong> {demoCredentials.email}</div>
          <div><strong>Demo password:</strong> {demoCredentials.password}</div>
        </div>
      </section>
    </div>
  );
}
