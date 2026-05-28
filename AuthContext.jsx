import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  email: 'demo@startup.com',
  password: 'password123',
  name: 'Demo User',
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const isAuthenticated = Boolean(currentUser);

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === DEMO_USER.email && password === DEMO_USER.password) {
      setCurrentUser({ email: DEMO_USER.email, name: DEMO_USER.name });
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password. Try the demo credentials.' };
  };

  const logout = () => setCurrentUser(null);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      login,
      logout,
      demoCredentials: { email: DEMO_USER.email, password: DEMO_USER.password },
    }),
    [currentUser, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
