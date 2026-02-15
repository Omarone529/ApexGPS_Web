import { apiFetch, tokenStore } from './api';

const API_BASE = '/users';

export async function login(identifier, password) {
  try {
    const data = await apiFetch(`${API_BASE}/login/`, {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });

    tokenStore.setTokens({
      access: data.access,
      refresh: data.refresh,
    });

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function loginWithGoogle(accessToken) {
  const payload = { access_token: accessToken };

  const data = await apiFetch(`${API_BASE}/login/google/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  tokenStore.setTokens({
    access: data.access,
    refresh: data.refresh,
  });

  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

export async function register(payload) {
  try {
    // Map fields from Frontend to Backend
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
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error('Me error:', error);
    throw error;
  }
}

export function logout() {
  tokenStore.clearTokens();
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return !!tokenStore.getAccessToken();
}
