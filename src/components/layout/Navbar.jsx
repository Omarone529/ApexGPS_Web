import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { tokenStore } from '../../services/api';
import { getCurrentUser, logout as authLogout } from '../../services/auth';

function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const location = useLocation();
    const navigate = useNavigate();

    const isPlannerPage = location.pathname === '/planner';
    const isHomePage = location.pathname === '/';

    const [user, setUser] = useState(getCurrentUser());
    const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStore.getAccess());

    const [isHeroVisible, setIsHeroVisible] = useState(true);

    const syncAuth = () => {
        setUser(getCurrentUser());
        setIsAuthenticated(!!tokenStore.getAccess());
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        syncAuth();

        const onStorage = e => {
            if (e.key === 'access_token' || e.key === 'refresh_token' || e.key === 'user') {
                syncAuth();
            }
        };
        window.addEventListener('storage', onStorage);

        const onAuthChange = () => syncAuth();
        window.addEventListener('auth-change', onAuthChange);

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('auth-change', onAuthChange);
        };
    }, []);

    const logout = () => {
        authLogout();
        syncAuth();
        navigate('/login');
    };

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

    useEffect(() => {
        if (!isHomePage || isPlannerPage) return;

        const hero = document.getElementById('hero');
        if (!hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsHeroVisible(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        observer.observe(hero);
        return () => observer.disconnect();
    }, [isHomePage, isPlannerPage]);

    const initials = user ? (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase() : 'U';

    const displayName = user?.first_name || user?.username || 'utente';

    const navBase = `fixed top-0 left-0 right-0 flex justify-between items-center py-3 px-16 z-50 transition-transform duration-300 ${
        isVisible ? '' : '-translate-y-full'
    }`;

    const navStyle = isPlannerPage
        ? 'bg-black text-white'
        : isHomePage
          ? isHeroVisible
              ? 'bg-transparent text-white'
              : 'bg-[#F5F3EC] text-[#1C1A18]'
          : 'bg-white/85 backdrop-blur-md text-[#1C1A18]';

    const linkClass =
        isPlannerPage || (isHomePage && isHeroVisible)
            ? 'text-white text-sm tracking-[1px] opacity-85 hover:opacity-100 transition'
            : 'text-[#1C1A18] text-sm tracking-[1px] opacity-80 hover:opacity-100 transition';

    const pillClass =
        isPlannerPage || (isHomePage && isHeroVisible)
            ? 'text-white text-sm tracking-[1px] opacity-85 py-2 px-4.5 border border-white/60 rounded-full hover:opacity-100 transition'
            : 'text-[#1C1A18] text-sm tracking-[1px] opacity-85 py-2 px-4.5 border border-black/20 rounded-full hover:opacity-100 transition';

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
                <Link className={linkClass} to="/">
                    Home
                </Link>
                <Link className={linkClass} to="/planner">
                    Planner
                </Link>
                <Link className={linkClass} to="/tour">
                    Tour
                </Link>

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
                                className={
                                    isPlannerPage || (isHomePage && isHeroVisible)
                                        ? 'text-white text-sm tracking-[1px] opacity-90'
                                        : 'text-[#1C1A18] text-sm tracking-[1px] opacity-90'
                                }
                            >
                                Ciao, <span className="font-semibold">{displayName}</span>
                            </span>
                        </div>

                        <button onClick={logout} className={pillClass}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className={pillClass}>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
