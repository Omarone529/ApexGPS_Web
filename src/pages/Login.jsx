import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/useAuth.jsx';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(identifier, password, rememberMe);
            navigate('/planner');
        } catch (err) {
            setError(err.message || 'Errore login');
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            setGoogleLoading(true);
            setError(null);
            try {
                await loginWithGoogle(tokenResponse.access_token, rememberMe);
                navigate('/planner');
            } catch (err) {
                setError(err.message || 'Errore login con Google');
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            setError("Errore durante l'autenticazione con Google");
            setGoogleLoading(false);
        },
        flow: 'implicit',
    });

    const isDisabled = loading || googleLoading;

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/register_login/background.webp')` }}
        >
            <div className="w-full max-w-md bg-black/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
                <h1 className="text-2xl mb-6 text-center font-semibold text-white">Login</h1>

                <button
                    onClick={() => handleGoogleLogin()}
                    disabled={isDisabled}
                    className="w-full mb-4 bg-white text-gray-800 p-3 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-60 flex items-center justify-center gap-2 border border-white/20"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {googleLoading ? 'Accesso con Google...' : 'Continua con Google'}
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-black/80 text-white/60">oppure</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        placeholder="Email o username"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        className="bg-white/10 border border-white/20 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60"
                        autoComplete="username"
                        disabled={isDisabled}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-white/10 border border-white/20 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60"
                        autoComplete="current-password"
                        disabled={isDisabled}
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="w-4 h-4 accent-orange-500"
                            disabled={isDisabled}
                        />
                        <label htmlFor="rememberMe" className="text-white/80 text-sm">
                            Ricordami
                        </label>
                    </div>

                    <button
                        className="bg-orange-500 text-white p-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-60"
                        disabled={isDisabled}
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
                            disabled={isDisabled}
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
