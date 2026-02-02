import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/planner');
    } catch (err) {
      setError(err.message || 'Errore login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Email o username"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="border p-2 rounded"
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
          autoComplete="current-password"
        />

        <button
          className="bg-orange-500 text-white p-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Accesso...' : 'Login'}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {/* Link registrazione */}
        <p className="text-sm opacity-80 mt-2">
          Non hai un account?{' '}
          <button type="button" className="underline" onClick={() => navigate('/register')}>
            Registrati
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
