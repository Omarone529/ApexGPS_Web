import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const lexend = { fontFamily: "'Lexend', sans-serif" };

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('apexgps_cookies_accepted');
        if (!accepted) {
            const t = setTimeout(() => {
                setVisible(true);
                // Forza un frame prima di attivare la transizione
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => setAnimateIn(true));
                });
            }, 800);
            return () => clearTimeout(t);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('apexgps_cookies_accepted', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 sm:px-8 sm:pb-6"
            role="region"
            aria-label="Informativa cookie"
        >
            <div
                className={[
                    'mx-auto max-w-xl bg-[#1C1A18]/95 backdrop-blur-md rounded-2xl',
                    'px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4',
                    'border border-white/10 shadow-[0_8px_48px_rgba(0,0,0,0.35)]',
                    'transition-all duration-500 ease-out',
                    animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                ].join(' ')}
                style={lexend}
            >
                {/* Icona */}
                <div className="flex-shrink-0 flex items-center justify-center">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Ombra */}
                        <ellipse cx="24" cy="44" rx="10" ry="2.5" fill="black" opacity="0.15" />
                        {/* Base biscotto */}
                        <circle cx="24" cy="23" r="18" fill="#C8813A" />
                        {/* Luce superiore — effetto croccante */}
                        <circle cx="24" cy="23" r="18" fill="url(#cookieLight)" />
                        {/* Bordo dorato */}
                        <circle
                            cx="24"
                            cy="23"
                            r="18"
                            fill="none"
                            stroke="#A0612A"
                            strokeWidth="1.2"
                        />
                        {/* Texture superficie */}
                        <circle
                            cx="24"
                            cy="23"
                            r="15"
                            fill="none"
                            stroke="#B8712A"
                            strokeWidth="0.4"
                            strokeDasharray="2 3"
                            opacity="0.4"
                        />
                        {/* Gocce cioccolato */}
                        <ellipse cx="17" cy="18" rx="2.8" ry="2.4" fill="#3D1F0A" />
                        <ellipse
                            cx="17"
                            cy="18"
                            rx="1.2"
                            ry="0.8"
                            fill="#5C3010"
                            transform="translate(-0.5 -0.8)"
                            opacity="0.5"
                        />
                        <ellipse cx="28" cy="16" rx="2.4" ry="2.2" fill="#3D1F0A" />
                        <ellipse
                            cx="28"
                            cy="16"
                            rx="1"
                            ry="0.7"
                            fill="#5C3010"
                            transform="translate(-0.4 -0.7)"
                            opacity="0.5"
                        />
                        <ellipse cx="15" cy="27" rx="2.2" ry="2" fill="#3D1F0A" />
                        <ellipse cx="27" cy="28" rx="2.6" ry="2.4" fill="#3D1F0A" />
                        <ellipse
                            cx="27"
                            cy="28"
                            rx="1.1"
                            ry="0.8"
                            fill="#5C3010"
                            transform="translate(-0.4 -0.8)"
                            opacity="0.5"
                        />
                        <ellipse cx="22" cy="32" rx="2" ry="1.8" fill="#3D1F0A" />
                        <ellipse cx="32" cy="22" rx="2.2" ry="2" fill="#3D1F0A" />
                        {/* Crepa principale */}
                        <path
                            d="M22 8 Q24 13 22 17 Q25 21 23 27 Q24 30 22 34"
                            stroke="#A0612A"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            fill="none"
                            opacity="0.7"
                        />
                        {/* Crepa secondaria */}
                        <path
                            d="M29 12 Q27 15 28 18"
                            stroke="#A0612A"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            fill="none"
                            opacity="0.5"
                        />
                        <defs>
                            <radialGradient id="cookieLight" cx="38%" cy="32%" r="55%">
                                <stop offset="0%" stopColor="#E8A060" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#C8813A" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>

                {/* Testo */}
                <p className="flex-1 text-[13px] text-white/60 leading-relaxed font-light">
                    Usiamo solo cookie necessari al funzionamento del sito.
                    <br />
                    <Link
                        to="/cookies"
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                        Cookie Policy
                    </Link>
                </p>

                {/* Bottone */}
                <button
                    onClick={handleAccept}
                    className="flex-shrink-0 px-5 py-2 rounded-xl text-[13px] font-medium
                               bg-white/90 text-[#1C1A18] hover:bg-orange-500 hover:text-white
                               border border-white/20 transition-colors duration-200 active:scale-[0.98] whitespace-nowrap"
                >
                    Ho capito
                </button>
            </div>
        </div>
    );
}
