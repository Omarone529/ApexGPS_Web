const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

function getAccess() {
  return localStorage.getItem('access');
}
function getRefresh() {
  return localStorage.getItem('refresh');
}
function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
}
function clearTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = getRefresh();
  if (!refresh) throw new Error('Missing refresh token');

  const res = await fetch(`${API_BASE}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    clearTokens();
    throw new Error(data?.detail || 'Refresh failed');
  }

  // SimpleJWT normalmente ritorna { access: "..." }
  setTokens({ access: data.access });
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
  const url = `${API_BASE}${path}`;
  const method = options.method || 'GET';

  const headers = {
    ...(options.headers || {}),
  };

  // aggiungi JSON header solo se stai mandando un body e non è FormData
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

  // Se token scaduto → prova refresh UNA volta e ritenta
  if (res.status === 401 && getRefresh()) {
    const newAccess = await ensureRefreshedAccess();
    headers.Authorization = `Bearer ${newAccess}`;
    ({ res, data } = await doRequest());
  }

  if (!res.ok) {
    const msg = data?.detail || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export const tokenStore = {
  setTokens,
  clearTokens,
  getAccess,
  getRefresh,
  API_BASE,
};
