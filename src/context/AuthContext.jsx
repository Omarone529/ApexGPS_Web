/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import {
    login as apiLogin,
    loginWithGoogle as apiLoginWithGoogle,
    register as apiRegister,
    logout as apiLogout,
    getCurrentUser,
    isAuthenticated,
    me,
} from '../services/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadUser() {
            try {
                if (isAuthenticated()) {
                    const savedUser = getCurrentUser();
                    if (savedUser) {
                        setUser(savedUser);
                    }

                    try {
                        const userData = await me();
                        setUser(userData);
                    } catch (err) {
                        console.error('Errore nel caricamento utente:', err);
                        if (err.status === 401) {
                            apiLogout();
                            setUser(null);
                        }
                    }
                }
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function login(identifier, password, rememberMe = false) {
        setError(null);
        try {
            const data = await apiLogin(identifier, password, rememberMe);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message || 'Errore durante il login');
            throw err;
        }
    }

    async function loginWithGoogle(accessToken, rememberMe = false) {
        setError(null);
        try {
            const data = await apiLoginWithGoogle(accessToken, rememberMe);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message || 'Errore durante il login con Google');
            throw err;
        }
    }

    async function register(userData) {
        setError(null);
        try {
            const data = await apiRegister(userData);
            return data;
        } catch (err) {
            setError(err.message || 'Errore durante la registrazione');
            throw err;
        }
    }

    function logout() {
        apiLogout();
        setUser(null);
    }

    const value = {
        user,
        loading,
        error,
        login,
        loginWithGoogle,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth } from './useAuth.jsx';
