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
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/register_login/background.webp')` }}
    >
      <div className="w-full max-w-md bg-black/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-2xl mb-6 text-center font-semibold text-white">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Email o username"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            className="bg-white/10 border border-white/20 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60"
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-white/10 border border-white/20 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60"
            autoComplete="current-password"
          />

          <button
            className="bg-orange-500 text-white p-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Accesso...' : 'Login'}
          </button>

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <p className="text-sm text-white/80 text-center mt-2">
            Non hai un account?{' '}
            <button
              type="button"
              className="text-orange-400 font-medium hover:underline"
              onClick={() => navigate('/register')}
            >
              Registrati
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
