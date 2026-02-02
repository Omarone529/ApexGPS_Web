import { apiFetch, tokenStore } from './api';

export async function login(identifier, password) {
  const data = await apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });

  tokenStore.setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

export async function register(payload) {
  return apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function me() {
  return apiFetch('/auth/me/');
}

export function logout() {
  tokenStore.clearTokens();
}
