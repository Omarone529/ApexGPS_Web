import React, { useState, useEffect, useRef } from 'react';

const MEDIA_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

const GLOBAL_STYLES = `
  .font-display { font-family: 'Playfair Display', serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pillActivate {
    0%   { transform: scale(1); }
    45%  { transform: scale(1.07); }
    75%  { transform: scale(0.97); }
    100% { transform: scale(1); }
  }

  .animate-fadeUp { animation: fadeUp 0.45s ease both; }
  .card-enter     { animation: fadeUp 0.45s cubic-bezier(0.25,0.46,0.45,0.94) both; }
  .pill-activate  { animation: pillActivate 0.4s cubic-bezier(0.34,1.4,0.64,1) both; }

  .pill-fill {
    transition: transform 0.6s cubic-bezier(0.34,1.2,0.64,1), opacity 0.4s ease;
    transform-origin: left center;
  }
`;

function StatPill({ count, label, accent }) {
    const prevRef = useRef(count);
    const [bounce, setBounce] = useState(false);
    const isActive = accent && count > 0;

    useEffect(() => {
        if (count !== prevRef.current) {
            prevRef.current = count;
            requestAnimationFrame(() => requestAnimationFrame(() => setBounce(true)));
        }
    }, [count]);

    return (
        <span
            className={[
                'relative overflow-hidden inline-flex items-center rounded-full px-4 py-2',
                'text-[13px] font-medium font-body border select-none cursor-default',
                'shadow-sm transition-all duration-500',
                isActive
                    ? 'bg-[#FDF0E8] border-orange-300/50 text-[#E8692A] shadow-[0_0_0_3px_rgba(232,105,42,0.07)]'
                    : 'bg-white border-[#E2DDD3] text-[#6B6460]',
                bounce && 'pill-activate',
            ]
                .filter(Boolean)
                .join(' ')}
            onAnimationEnd={() => setBounce(false)}
        >
            {accent && (
                <span
                    aria-hidden
                    className="pill-fill absolute inset-0 rounded-full bg-[#FDF0E8] pointer-events-none"
                    style={{
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        opacity: isActive ? 1 : 0,
                    }}
                />
            )}
            <span className="relative z-10">
                <span className="font-semibold">{count}</span> {label}
            </span>
        </span>
    );
}

function Tour() {
    return (
        <>
            <style>{GLOBAL_STYLES}</style>
            <section className="font-body bg-[#F5F3EC] min-h-screen">
                <RoutesGrid />
            </section>
        </>
    );
}

function RoutesGrid() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [banningRouteId, setBanningRouteId] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [routeToBan, setRouteToBan] = useState(null);

    const getAuthHeaders = () => {
        const token = sessionStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    };

    const fetchCurrentUser = async () => {
        const token = sessionStorage.getItem('access_token');
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/users/me/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setCurrentUser(await res.json());
        } catch (err) {
            console.error('Failed to fetch current user', err);
        }
    };

    const fetchPublicRoutes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/routes/public/`, {
                headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error(`Failed to fetch routes: ${response.statusText}`);
            const data = await response.json();
            const formattedRoutes = data.map(route => ({
                id: route.id,
                title: route.name,
                area: `${route.start_location_name || '?'} → ${route.end_location_name || '?'}`,
                image: route.screenshot
                    ? route.screenshot.startsWith('http')
                        ? route.screenshot
                        : `${MEDIA_BASE_URL}${route.screenshot}`
                    : `https://picsum.photos/seed/${route.id}/300/400`,
                owner: route.owner_username || 'Anonymous',
            }));
            setRoutes(formattedRoutes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicRoutes();
        fetchCurrentUser();
    }, []);

    const handleConfirmBan = async () => {
        if (!routeToBan) return;
        setShowBanModal(false);
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            alert('Devi essere autenticato come amministratore.');
            return;
        }
        setBanningRouteId(routeToBan.id);
        try {
            const res = await fetch(`${API_BASE_URL}/routes/${routeToBan.id}/ban/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Errore durante il ban del percorso');
            }
            setRoutes(prev => prev.filter(r => r.id !== routeToBan.id));
        } catch (err) {
            alert(`Errore: ${err.message}`);
        } finally {
            setBanningRouteId(null);
            setRouteToBan(null);
        }
    };

    const handleCancelBan = () => {
        setShowBanModal(false);
        setRouteToBan(null);
    };

    const isAdmin = currentUser?.is_administrator === true;
    const sectionPadding = 'clamp(1.5rem, 5vw, 4rem)';

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 min-h-[60vh] text-[#9B958F]">
                <div className="w-5 h-5 rounded-full border-2 border-[#E2DDD3] border-t-[#E8692A] animate-spin" />
                <span className="text-[13px] font-body">Caricamento percorsi…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-8 font-body text-sm">
                Errore nel caricamento: {error}
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <header
                className="bg-[#F5F3EC] border-b border-[#E2DDD3]"
                style={{
                    paddingTop: 'clamp(4rem, 6vw, 5rem)',
                    paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
                    paddingLeft: sectionPadding,
                    paddingRight: sectionPadding,
                }}
            >
                <div className="max-w-[1280px] mx-auto animate-fadeUp">
                    <div className="flex justify-end mb-6">
                        <StatPill count={routes.length} label="percorsi" accent={false} />
                    </div>
                    <h1
                        className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium
                                   text-[#1A1814] leading-[1.15] tracking-[-0.02em]"
                    >
                        Scopri i percorsi degli utenti
                    </h1>
                </div>
            </header>

            {/* Main */}
            <main
                className="py-10 pb-20"
                style={{ paddingLeft: sectionPadding, paddingRight: sectionPadding }}
            >
                <div className="max-w-[1280px] mx-auto">
                    {routes.length === 0 && (
                        <div className="text-center py-20 animate-fadeUp">
                            <div className="w-14 h-14 rounded-[16px] bg-[#EDE9DF] flex items-center justify-center mx-auto mb-4 text-[#9B958F]">
                                <svg
                                    width="26"
                                    height="26"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="font-display text-[20px] font-medium text-[#1A1814] mb-2">
                                Nessun percorso disponibile
                            </h2>
                            <p className="text-[13px] text-[#9B958F] font-body">
                                I percorsi pubblici degli utenti appariranno qui.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {routes.map((route, idx) => (
                            <RouteCard
                                key={route.id}
                                route={route}
                                idx={idx}
                                isAdmin={isAdmin}
                                banningRouteId={banningRouteId}
                                onBan={() => {
                                    setRouteToBan(route);
                                    setShowBanModal(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Ban confirmation modal */}
            {showBanModal && routeToBan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E2DDD3] animate-fadeUp">
                        <h3 className="font-display text-[20px] font-medium text-[#1A1814] mb-2">
                            Conferma rimozione
                        </h3>
                        <p className="text-[13.5px] text-[#6B6460] font-body mb-6">
                            Sei sicuro di voler rendere privato il percorso{' '}
                            <span className="font-semibold text-[#1A1814]">{routeToBan.title}</span>
                            ? Non sarà più visibile pubblicamente.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelBan}
                                className="px-5 py-2 rounded-xl text-[13px] font-medium font-body
                                           bg-[#F5F3EC] border border-[#E2DDD3] text-[#6B6460]
                                           hover:bg-[#EDE9DF] transition-all duration-200"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleConfirmBan}
                                className="px-5 py-2 rounded-xl text-[13px] font-medium font-body
                                           bg-red-500 text-white border border-red-500
                                           hover:bg-red-600 hover:shadow-[0_6px_20px_rgba(239,68,68,0.3)]
                                           transition-all duration-200"
                            >
                                Conferma
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function RouteCard({ route, idx, isAdmin, banningRouteId, onBan }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold: 0.06 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={[
                'group bg-white rounded-[20px] border border-[#E2DDD3] overflow-hidden cursor-pointer',
                'shadow-[0_1px_3px_rgba(26,24,20,0.06)] transition-all duration-300',
                'hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(26,24,20,0.09)] hover:border-transparent',
                visible ? 'card-enter' : 'opacity-0',
            ].join(' ')}
            style={{ animationDelay: `${idx * 0.05}s` }}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE9DF]">
                <img
                    src={route.image}
                    alt={route.title}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25 pointer-events-none" />

                {/* Admin hide button */}
                {isAdmin && (
                    <div className="absolute top-3 right-3 z-10">
                        <button
                            onClick={onBan}
                            disabled={banningRouteId === route.id}
                            title="Nascondi percorso"
                            className={[
                                'w-8 h-8 rounded-full flex items-center justify-center',
                                'bg-white/90 backdrop-blur-sm border border-black/8 shadow-sm',
                                'opacity-0 group-hover:opacity-100 transition-all duration-200',
                                banningRouteId === route.id
                                    ? 'cursor-not-allowed opacity-40'
                                    : 'hover:bg-red-50 hover:text-red-500 hover:scale-110 text-[#9B8880]',
                            ].join(' ')}
                        >
                            {banningRouteId === route.id ? (
                                <svg
                                    className="animate-spin h-3.5 w-3.5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">
                <h3 className="font-display text-[17px] font-medium text-[#1A1814] leading-snug mb-1.5">
                    {route.title}
                </h3>

                <p className="flex items-center gap-1.5 text-[12.5px] text-[#9B958F] mb-1 font-body">
                    <svg
                        width="11"
                        height="11"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="flex-shrink-0 opacity-50"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    {route.area}
                </p>

                <p className="text-[11.5px] text-[#B0AAA4] font-body mb-4">by {route.owner}</p>

                <button
                    className="w-full py-2.5 rounded-xl text-[13px] font-medium font-body
                               bg-[#F5F3EC] border border-[#E2DDD3] text-[#6B6460]
                               transition-all duration-200
                               hover:bg-[#E8692A] hover:border-[#E8692A] hover:text-white
                               hover:shadow-[0_6px_20px_rgba(232,105,42,0.22)]
                               active:scale-[0.99]"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default Tour;
