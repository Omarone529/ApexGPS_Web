import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/useAuth.jsx';
import { FiMenu, FiX } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    const [isVisible, setIsVisible] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);

    const isPlannerPage = location.pathname === '/planner';
    const isHomePage = location.pathname === '/';
    const isOtherPage = !isPlannerPage && !isHomePage;

    const [isHeroVisible, setIsHeroVisible] = useState(true);

    // Close mobile menu on route change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (isPlannerPage) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
        }
    }, [isPlannerPage]);

    useEffect(() => {
        if (isPlannerPage) return;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
                setIsVisible(false);
                setMobileMenuOpen(false);
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
            ([entry]) => setIsHeroVisible(entry.isIntersecting),
            { threshold: 0.15 }
        );
        observer.observe(hero);
        return () => observer.disconnect();
    }, [isHomePage, isPlannerPage]);

    const initials = user ? (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase() : 'U';
    const displayName = user?.first_name || user?.username || 'utente';
    const isAdmin = user?.is_administrator === true;

    const navBase = `fixed top-0 left-0 right-0 flex justify-between items-center py-3 px-4 sm:px-8 md:px-16 z-[1200] transition-transform duration-300 ${
        isVisible ? '' : '-translate-y-full'
    }`;

    const navStyle = isPlannerPage
        ? 'bg-[#FAF7F2] text-gray-800'
        : isHomePage
          ? isHeroVisible
              ? 'bg-transparent text-white'
              : 'bg-[#F5F3EC] text-[#1C1A18]'
          : 'bg-white/85 backdrop-blur-md text-[#1C1A18]';

    const useDarkText = isPlannerPage || isOtherPage || (isHomePage && !isHeroVisible);
    const linkColor = useDarkText ? 'text-[#1C1A18]' : 'text-white';
    const borderColor = useDarkText ? 'border-gray-400/60' : 'border-white/60';

    // Mobile menu styling — sempre chiaro su tutte le pagine
    const mobileMenuBg = isPlannerPage ? 'bg-[#FAF7F2]' : 'bg-white/95 backdrop-blur-md';
    const mobileLinkColor = 'text-[#1C1A18]';
    const mobileDividerColor = 'border-[#1C1A18]/10';

    return (
        <>
            <nav className={`${navBase} ${navStyle}`}>
                {/* Logo */}
                <div>
                    <Link to="/" className="flex items-center gap-3 -ml-8 sm:-ml-12 md:-ml-20">
                        <img
                            src="/ApexGPS_logo.png"
                            alt="ApexGPS Logo"
                            className="h-20 sm:h-24 md:h-32 w-auto -my-8 sm:-my-10 md:-my-14"
                        />
                    </Link>
                </div>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${linkColor}`}
                        to="/"
                    >
                        Home
                    </Link>
                    <Link
                        className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${linkColor}`}
                        to="/planner"
                    >
                        Planner
                    </Link>
                    <Link
                        className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${linkColor}`}
                        to="/tour"
                    >
                        Tour
                    </Link>

                    {isAuthenticated && (
                        <Link
                            className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${linkColor}`}
                            to="/mytours"
                        >
                            I miei percorsi
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            className={`text-sm tracking-[1px] opacity-85 hover:opacity-100 ${linkColor}`}
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
                                <span className={`text-sm tracking-[1px] opacity-90 ${linkColor}`}>
                                    Ciao, <span className="font-semibold">{displayName}</span>
                                </span>
                            </div>

                            <button
                                onClick={logout}
                                className={`text-sm tracking-[1px] py-2 px-4.5 border rounded-full hover:opacity-100 ${linkColor} ${borderColor}`}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className={`text-sm tracking-[1px] opacity-85 py-2 px-4.5 border rounded-full hover:opacity-100 ${linkColor} ${borderColor}`}
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger button */}
                <button
                    className={`md:hidden p-2 rounded-lg transition-colors touch-manipulation ${mobileMenuOpen ? 'text-[#1C1A18]' : linkColor}`}
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </nav>

            {/* Mobile full-screen menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`fixed inset-0 z-[1100] ${mobileMenuBg} flex flex-col md:hidden`}
                        style={{ paddingTop: '4.5rem' }}
                    >
                        {/* Nav links */}
                        <nav className="flex flex-col flex-1 overflow-y-auto px-6 pt-4">
                            <Link
                                to="/"
                                className={`text-xl font-medium py-5 border-b ${mobileDividerColor} ${mobileLinkColor} active:opacity-60 transition-opacity`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/planner"
                                className={`text-xl font-medium py-5 border-b ${mobileDividerColor} ${mobileLinkColor} active:opacity-60 transition-opacity`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Planner
                            </Link>
                            <Link
                                to="/tour"
                                className={`text-xl font-medium py-5 border-b ${mobileDividerColor} ${mobileLinkColor} active:opacity-60 transition-opacity`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tour
                            </Link>

                            {isAuthenticated && (
                                <Link
                                    to="/mytours"
                                    className={`text-xl font-medium py-5 border-b ${mobileDividerColor} ${mobileLinkColor} active:opacity-60 transition-opacity`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    I miei percorsi
                                </Link>
                            )}

                            {isAdmin && (
                                <Link
                                    to="/admin/users"
                                    className={`text-xl font-medium py-5 border-b ${mobileDividerColor} ${mobileLinkColor} active:opacity-60 transition-opacity`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Gestione Utenti
                                </Link>
                            )}
                        </nav>

                        {/* Auth section at bottom */}
                        <div className="px-6 pb-10 pt-6">
                            {isAuthenticated && user ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        {user.profile_picture ? (
                                            <img
                                                src={user.profile_picture}
                                                alt={displayName}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                                {initials}
                                            </div>
                                        )}
                                        <div>
                                            <p className={`text-sm opacity-60 ${mobileLinkColor}`}>
                                                Accesso effettuato come
                                            </p>
                                            <p className={`font-semibold ${mobileLinkColor}`}>
                                                {displayName}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full py-4 border rounded-full text-center font-medium transition-colors touch-manipulation ${mobileLinkColor} ${mobileDividerColor} border-current/30 hover:bg-current/5`}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block w-full py-4 bg-orange-500 text-white text-center rounded-full font-medium hover:bg-orange-600 transition touch-manipulation"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navbar;
