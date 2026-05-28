import { useAuth } from '../context/AuthContext';

export default function AppShell({ children }) {
  const { currentUser, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Sample React web app</p>
          <h1>TaskFlow Dashboard</h1>
        </div>
        <div className="topbar-actions">
          <div className="user-pill">Signed in as <strong>{currentUser?.name}</strong></div>
          <button className="secondary-button" onClick={logout}>Log out</button>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
