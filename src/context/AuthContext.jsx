/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../services/auth';
import { tokenStore } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authed | guest

  useEffect(() => {
    // All'avvio: se ho token provo a caricare /me
    const boot = async () => {
      const access = tokenStore.getAccess();
      const refresh = tokenStore.getRefresh();

      if (!access && !refresh) {
        setStatus('guest');
        return;
      }

      try {
        const u = await auth.me();
        setUser(u);
        setStatus('authed');
      } catch {
        auth.logout();
        setUser(null);
        setStatus('guest');
      }
    };

    boot();
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authed',
      login: async (identifier, password) => {
        const data = await auth.login(identifier, password);

        // se il backend ritorna già l'utente, usalo
        if (data?.user) {
          setUser(data.user);
          setStatus('authed');
          return;
        }

        // fallback (se un giorno togli user dalla response login)
        try {
          const u = await auth.me();
          setUser(u);
          setStatus('authed');
        } catch {
          setUser(null);
          setStatus('authed');
        }
      },
      logout: () => {
        auth.logout();
        setUser(null);
        setStatus('guest');
      },
      refreshUser: async () => {
        const u = await auth.me();
        setUser(u);
        setStatus('authed');
        return u;
      },
    }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
