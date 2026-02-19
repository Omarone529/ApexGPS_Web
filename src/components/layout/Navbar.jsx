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

  const [user, setUser] = useState(getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStore.getAccess());

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

    // Ascolta evento personalizzato per aggiornamenti nella stessa scheda
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

  const initials = user ? (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase() : 'U';
  const displayName = user?.first_name || user?.username || 'utente';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 flex justify-between items-center py-6 px-16 z-50 transition-transform ${
        isPlannerPage ? 'bg-black' : 'bg-transparent'
      } ${isVisible ? '' : '-translate-y-full'}`}
    >
      <div>
        <Link to="/" className="flex items-center gap-3 -ml-20">
          <img src="/ApexGPS_logo.png" alt="ApexGPS Logo" className="h-32 w-auto -my-14" />
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <Link className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100" to="/">
          Home
        </Link>
        <Link
          className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100"
          to="/planner"
        >
          Planner
        </Link>
        <Link className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100" to="/tour">
          Tour
        </Link>
        <Link
          className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100"
          to="/altro"
        >
          Altro
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
              <span className="text-white text-sm tracking-[1px] opacity-90">
                Ciao, <span className="font-semibold">{displayName}</span>
              </span>
            </div>

            <button
              onClick={logout}
              className="text-white text-sm tracking-[1px] py-2 px-4.5 border border-white/60 rounded-full hover:opacity-100"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-white text-sm tracking-[1px] opacity-85 py-2 px-4.5 border border-white/60 rounded-full hover:opacity-100"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
