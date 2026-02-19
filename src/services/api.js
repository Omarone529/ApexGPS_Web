const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getFromStorages(key) {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

function getAccess() {
  return getFromStorages('access_token');
}

function getRefresh() {
  return getFromStorages('refresh_token');
}

function setTokensOnLogin({ access, refresh }, rememberMe) {
  const targetStorage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  targetStorage.setItem('access_token', access);
  targetStorage.setItem('refresh_token', refresh);

  otherStorage.removeItem('access_token');
  otherStorage.removeItem('refresh_token');
}

function updateAccessToken(access) {
  const refreshInLocal = localStorage.getItem('refresh_token');
  const refreshInSession = sessionStorage.getItem('refresh_token');
  const storage = refreshInLocal ? localStorage : refreshInSession ? sessionStorage : null;

  if (!storage) {
    throw new Error('No refresh token found');
  }

  storage.setItem('access_token', access);

  const otherStorage = storage === localStorage ? sessionStorage : localStorage;
  otherStorage.removeItem('access_token');
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = getRefresh();
  if (!refresh) throw new Error('Missing refresh token');

  const res = await fetch(`${API_BASE}/api/users/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    clearTokens();
    throw new Error(data?.detail || 'Refresh failed');
  }

  updateAccessToken(data.access);
  return data.access;
}

async function ensureRefreshedAccess() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}/api${path}`;
  console.log('🌐 Chiamata API:', url);

  const method = options.method || 'GET';

  const headers = {
    ...(options.headers || {}),
  };

  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const access = getAccess();
  if (access) headers.Authorization = `Bearer ${access}`;

  const doRequest = async () => {
    const res = await fetch(url, { ...options, method, headers });
    const data = await res.json().catch(() => null);
    return { res, data };
  };

  let { res, data } = await doRequest();

  if (res.status === 401 && access && getRefresh()) {
    try {
      const newAccess = await ensureRefreshedAccess();
      headers.Authorization = `Bearer ${newAccess}`;
      ({ res, data } = await doRequest());
    } catch (refreshError) {
      clearTokens();
      window.location.href = '/login';
      throw refreshError;
    }
  }

  if (!res.ok) {
    const msg = data?.detail || data?.message || `HTTP ${res.status}`;
    const error = new Error(msg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const tokenStore = {
  setTokensOnLogin,
  updateAccessToken,
  clearTokens,
  getAccessToken: getAccess,
  getRefreshToken: getRefresh,
  getAccess,
  getRefresh,
  API_BASE,
};
