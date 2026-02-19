import { apiFetch, tokenStore } from './api';

const API_BASE = '/users';

export async function login(identifier, password, rememberMe = false) {
  try {
    const data = await apiFetch(`${API_BASE}/login/`, {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });

    tokenStore.setTokensOnLogin(
      {
        access: data.access,
        refresh: data.refresh,
      },
      rememberMe
    );

    if (data.user) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(data.user));
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem('user');
    }
    window.dispatchEvent(new Event('auth-change'));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function loginWithGoogle(accessToken, rememberMe = false) {
  const payload = { access_token: accessToken };

  const data = await apiFetch(`${API_BASE}/login/google/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  tokenStore.setTokensOnLogin(
    {
      access: data.access,
      refresh: data.refresh,
    },
    rememberMe
  );

  if (data.user) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(data.user));
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem('user');
  }
  window.dispatchEvent(new Event('auth-change'));

  return data;
}

export async function register(payload) {
  try {
    const backendPayload = {
      email: payload.email,
      username: payload.username,
      password: payload.password,
      first_name: payload.first_name || payload.firstName,
      last_name: payload.last_name || payload.lastName,
    };

    const data = await apiFetch(`${API_BASE}/register/`, {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });

    return data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

export async function me() {
  try {
    const data = await apiFetch(`${API_BASE}/me/`);
    if (data) {
      // Determine which storage to use based on existing refresh token
      const refreshInLocal = localStorage.getItem('refresh_token');
      const refreshInSession = sessionStorage.getItem('refresh_token');
      const storage = refreshInLocal ? localStorage : refreshInSession ? sessionStorage : null;
      if (storage) {
        storage.setItem('user', JSON.stringify(data));
        const otherStorage = storage === localStorage ? sessionStorage : localStorage;
        otherStorage.removeItem('user');
      } else {
        sessionStorage.setItem('user', JSON.stringify(data));
      }
      window.dispatchEvent(new Event('auth-change'));
    }
    return data;
  } catch (error) {
    console.error('Me error:', error);
    throw error;
  }
}

export function logout() {
  tokenStore.clearTokens();
  window.dispatchEvent(new Event('auth-change'));
}

export function getCurrentUser() {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return !!tokenStore.getAccessToken();
}
