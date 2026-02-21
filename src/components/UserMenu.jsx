import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function UserMenu() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const initials = (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full p-1 pr-3 transition"
            >
                {/* Foto profilo o iniziali */}
                {user.profile_picture ? (
                    <img
                        src={user.profile_picture}
                        alt={user.first_name || user.username}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        {initials}
                    </div>
                )}
                <span className="text-white text-sm hidden md:block">
                    {user.first_name || user.username}
                </span>
                <svg
                    className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-white/10 z-20">
                        <div className="py-1">
                            <div className="px-4 py-2 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    {user.profile_picture ? (
                                        <img
                                            src={user.profile_picture}
                                            alt={user.first_name || user.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                            {initials}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-white text-sm font-medium">
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="text-white/60 text-xs truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/profile');
                                }}
                                className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
                            >
                                Il mio profilo
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/my-routes');
                                }}
                                className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
                            >
                                I miei percorsi
                            </button>

                            <hr className="border-white/10 my-1" />

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleLogout();
                                }}
                                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserMenu;
