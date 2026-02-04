import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as auth from '../services/auth';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      await auth.register({
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      });

      await login(email || username, password);
      navigate('/planner');
    } catch (err) {
      setError(err.message || 'Errore registrazione');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl mb-6 text-center font-semibold">Registrati</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            autoComplete="email"
          />

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            autoComplete="username"
          />

          <div className="flex gap-3">
            <input
              placeholder="Nome"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-1/2"
              autoComplete="given-name"
            />
            <input
              placeholder="Cognome"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-1/2"
              autoComplete="family-name"
            />
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            autoComplete="new-password"
          />

          <button
            className="bg-orange-500 text-white p-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Creazione...' : 'Crea account'}
          </button>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <p className="text-sm text-gray-600 text-center">
            Hai già un account?{' '}
            <button
              type="button"
              className="text-orange-500 font-medium hover:underline"
              onClick={() => navigate('/login')}
            >
              Vai al login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
