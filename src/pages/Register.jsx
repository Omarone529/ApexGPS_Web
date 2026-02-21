import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../services/auth';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        username: false,
        password: false,
        confirmPassword: false,
    });

    const navigate = useNavigate();

    // Validation fields
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isUsernameValid = username.length >= 3 && username.length <= 20;
    const isFirstNameValid = firstName.trim().length >= 2;
    const isLastNameValid = lastName.trim().length >= 2;
    const passwordCriteria = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const passwordStrength = Object.values(passwordCriteria).filter(Boolean).length;
    const isPasswordValid = passwordStrength >= 4;
    const passwordsMatch = password === confirmPassword;
    const isConfirmPasswordValid = passwordsMatch && confirmPassword.length > 0;

    const isFormValid =
        isEmailValid &&
        isUsernameValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isPasswordValid &&
        passwordsMatch;

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!isFormValid) {
            setError('Per favore, completa tutti i campi correttamente');
            return;
        }

        setLoading(true);

        try {
            await auth.register({
                email,
                username,
                first_name: firstName,
                last_name: lastName,
                password,
            });

            // Redirect to login after successful registration
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Errore nella registrazione');
        } finally {
            setLoading(false);
        }
    }

    const handleBlur = field => () => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-500';
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength === 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return 'Molto debole';
        if (passwordStrength <= 2) return 'Debole';
        if (passwordStrength === 3) return 'Buona';
        return 'Forte';
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/register_login/background.webp')` }}
        >
            <div className="w-full max-w-md bg-black/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
                <h1 className="text-2xl mb-6 text-center font-semibold text-white">Registrati</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Email */}
                    <div className="relative">
                        <input
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={handleBlur('email')}
                            className={`bg-white/10 border ${
                                touched.email
                                    ? isEmailValid
                                        ? 'border-green-500/50'
                                        : 'border-red-500/50'
                                    : 'border-white/20'
                            } text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60 w-full transition-all duration-300`}
                            autoComplete="email"
                            type="email"
                        />
                        {touched.email && isEmailValid && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"></span>
                        )}
                        {touched.email && !isEmailValid && email && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"></span>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onBlur={handleBlur('username')}
                            className={`bg-white/10 border ${
                                touched.username
                                    ? isUsernameValid
                                        ? 'border-green-500/50'
                                        : 'border-red-500/50'
                                    : 'border-white/20'
                            } text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60 w-full transition-all duration-300`}
                            autoComplete="username"
                        />
                        {touched.username && isUsernameValid && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"></span>
                        )}
                        {touched.username && !isUsernameValid && username && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"></span>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <input
                                placeholder="Nome"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                className="bg-white/10 border border-white/20 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60 w-full"
                                autoComplete="given-name"
                            />
                        </div>

                        <div className="flex-1">
                            <input
                                placeholder="Cognome"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                className="bg-white/10 border border-white/20 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60 w-full"
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onBlur={handleBlur('password')}
                                className={`bg-white/10 border ${
                                    touched.password
                                        ? isPasswordValid
                                            ? 'border-green-500/50'
                                            : 'border-red-500/50'
                                        : 'border-white/20'
                                } text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60 w-full transition-all duration-300`}
                                autoComplete="new-password"
                            />
                            {touched.password && isPasswordValid && (
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"></span>
                            )}
                        </div>

                        {password && (
                            <div className="p-3 bg-black/40 rounded-lg border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-white/80">
                                        Sicurezza password:
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${
                                            passwordStrength >= 4
                                                ? 'text-green-400'
                                                : passwordStrength >= 3
                                                  ? 'text-yellow-400'
                                                  : 'text-red-400'
                                        }`}
                                    >
                                        {getPasswordStrengthText()}
                                    </span>
                                </div>

                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div
                                            key={i}
                                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                                i <= passwordStrength
                                                    ? getPasswordStrengthColor()
                                                    : 'bg-gray-700'
                                            }`}
                                        ></div>
                                    ))}
                                </div>

                                <div className="space-y-1 text-sm">
                                    {Object.entries({
                                        length: 'Almeno 8 caratteri',
                                        uppercase: 'Una lettera maiuscola',
                                        lowercase: 'Una lettera minuscola',
                                        number: 'Un numero',
                                        special: 'Un carattere speciale',
                                    }).map(([key, text]) => (
                                        <div
                                            key={key}
                                            className={`flex items-center gap-2 ${
                                                passwordCriteria[key]
                                                    ? 'text-green-400'
                                                    : 'text-white/60'
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    passwordCriteria[key]
                                                        ? 'bg-green-400'
                                                        : 'bg-white/30'
                                                }`}
                                            ></span>
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Conferma password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            onBlur={handleBlur('confirmPassword')}
                            className={`bg-white/10 border ${
                                touched.confirmPassword
                                    ? isConfirmPasswordValid
                                        ? 'border-green-500/50'
                                        : 'border-red-500/50'
                                    : 'border-white/20'
                            } text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-white/60 w-full transition-all duration-300`}
                            autoComplete="new-password"
                        />
                        {touched.confirmPassword && isConfirmPasswordValid && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
                                ✓
                            </span>
                        )}
                        {touched.confirmPassword && !isConfirmPasswordValid && confirmPassword && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"></span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className={`bg-orange-500 text-white p-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-60 ${
                            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Registrazione in corso...' : 'Crea account'}
                    </button>

                    {error && (
                        <div className="bg-red-900/30 border border-red-700/50 text-red-300 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <p className="text-sm text-white/80 text-center mt-2">
                        Hai già un account?{' '}
                        <button
                            type="button"
                            className="text-orange-400 font-medium hover:underline"
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
