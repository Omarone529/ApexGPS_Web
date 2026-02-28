import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/useAuth.jsx';

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth(); // get from context
    const location = useLocation();

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const isPlannerPage = location.pathname === '/planner';
    const isHomePage = location.pathname === '/';

    const [isHeroVisible, setIsHeroVisible] = useState(true);

    // Scroll logic (unchanged)
    useEffect(() => {
        if (isPlannerPage) return;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isPlannerPage]);

    // Hero visibility logic (unchanged)
    useEffect(() => {
        if (!isHomePage || isPlannerPage) return;
        const hero = document.getElementById('hero');
        if (!hero) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsHeroVisible(entry.isIntersecting),
            { threshold: 0.15 }
        );
        observer.observe(hero);
        return () => observer.disconnect();
    }, [isHomePage, isPlannerPage]);

    // Derived values for display
    const initials = user ? (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase() : 'U';
    const displayName = user?.first_name || user?.username || 'utente';
    const isAdmin = user?.is_administrator === true;

    const navBase = `fixed top-0 left-0 right-0 flex justify-between items-center py-3 px-16 z-50 transition-transform duration-300 ${
        isVisible ? '' : '-translate-y-full'
    }`;

    const navStyle = isPlannerPage
        ? 'bg-[#FAF7F2] text-gray-800'
        : isHomePage
          ? isHeroVisible
              ? 'bg-transparent text-white'
              : 'bg-[#F5F3EC] text-[#1C1A18]'
          : 'bg-white/85 backdrop-blur-md text-[#1C1A18]';

    return (
        <nav className={`${navBase} ${navStyle}`}>
            <div>
                <Link to="/" className="flex items-center gap-3 -ml-20">
                    <img
                        src="/ApexGPS_logo.png"
                        alt="ApexGPS Logo"
                        className="h-32 w-auto -my-14"
                    />
                </Link>
            </div>

            <div className="flex items-center gap-8">
                <Link
                    className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${
                        isPlannerPage || (isHomePage && !isHeroVisible)
                            ? 'text-[#1C1A18]'
                            : 'text-white'
                    }`}
                    to="/"
                >
                    Home
                </Link>
                <Link
                    className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${
                        isPlannerPage || (isHomePage && !isHeroVisible)
                            ? 'text-[#1C1A18]'
                            : 'text-white'
                    }`}
                    to="/planner"
                >
                    Planner
                </Link>
                <Link
                    className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${
                        isPlannerPage || (isHomePage && !isHeroVisible)
                            ? 'text-[#1C1A18]'
                            : 'text-white'
                    }`}
                    to="/tour"
                >
                    Tour
                </Link>

                {isAuthenticated && (
                    <Link
                        className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${
                            isPlannerPage || (isHomePage && !isHeroVisible)
                                ? 'text-[#1C1A18]'
                                : 'text-white'
                        }`}
                        to="/mytours"
                    >
                        I miei percorsi
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${
                            isPlannerPage || (isHomePage && !isHeroVisible)
                                ? 'text-[#1C1A18]'
                                : 'text-white'
                        }`}
                        to="/admin/users"
                    >
                        Gestione Utenti
                    </Link>
                )}

                {isAuthenticated && user ? (
                    <>
                        <div className="flex items-center gap-3">
                            {user.profile_picture ? (
                                <img
                                    src={user.profile_picture}
                                    alt={displayName}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                    {initials}
                                </div>
                            )}
                            <span
                                className={`text-sm tracking-[1px] opacity-90 ${
                                    isPlannerPage || (isHomePage && !isHeroVisible)
                                        ? 'text-[#1C1A18]'
                                        : 'text-white'
                                }`}
                            >
                                Ciao, <span className="font-semibold">{displayName}</span>
                            </span>
                        </div>

                        <button
                            onClick={logout}
                            className={`text-sm tracking-[1px] py-2 px-4.5 border rounded-full hover:opacity-100 ${
                                isPlannerPage || (isHomePage && !isHeroVisible)
                                    ? 'text-[#1C1A18] border-gray-400/60'
                                    : 'text-white border-white/60'
                            }`}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className={`text-sm tracking-[1px] opacity-85 py-2 px-4.5 border rounded-full hover:opacity-100 ${
                            isPlannerPage || (isHomePage && !isHeroVisible)
                                ? 'text-[#1C1A18] border-gray-400/60'
                                : 'text-white border-white/60'
                        }`}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
