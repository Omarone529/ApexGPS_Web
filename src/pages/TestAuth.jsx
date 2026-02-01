import { useEffect, useState } from 'react';
import { me, logout } from '../services/auth';

export default function TestAuth() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    me()
      .then(setData)
      .catch(e => setErr(e.message));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Auth</h1>

      <button
        className="border px-3 py-2 rounded"
        onClick={() => {
          logout();
          window.location.href = '/login';
        }}
      >
        Logout
      </button>

      <div className="mt-4">
        {err && <p className="text-red-500">{err}</p>}
        <pre className="text-sm">{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
      </div>
    </div>
  );
}
