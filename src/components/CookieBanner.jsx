import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const lexend = { fontFamily: "'Lexend', sans-serif" };

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('apexgps_cookies_accepted');
        if (!accepted) {
            const t = setTimeout(() => {
                setVisible(true);
                requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
            }, 800);
            return () => clearTimeout(t);
        }
    }, []);

    const handleAccept = () => {
        setAnimating(false);
        setTimeout(() => {
            localStorage.setItem('apexgps_cookies_accepted', 'true');
            setVisible(false);
        }, 350);
    };

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes cookie-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                @keyframes cookie-down {
                    from { transform: translateY(0);    opacity: 1; }
                    to   { transform: translateY(100%); opacity: 0; }
                }
                .cookie-enter { animation: cookie-up 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) forwards; }
                .cookie-exit  { animation: cookie-down 0.35s cubic-bezier(0.4, 0, 1, 1) forwards; }
            `}</style>

            <div
                className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 sm:px-8 sm:pb-6"
                role="region"
                aria-label="Informativa cookie"
            >
                <div
                    className={`mx-auto max-w-xl bg-[#1C1A18]/95 backdrop-blur-md rounded-2xl
                               px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4
                               border border-white/10 shadow-[0_8px_48px_rgba(0,0,0,0.35)]
                               ${animating ? 'cookie-enter' : 'cookie-exit'}`}
                    style={lexend}
                >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <p className="flex-1 text-[13px] text-white/60 leading-relaxed font-light">
                        Usiamo solo cookie necessari al funzionamento del sito.{' '}
                        <Link
                            to="/cookies"
                            className="text-white/90 hover:text-white underline underline-offset-2 transition-colors"
                        >
                            Cookie Policy
                        </Link>
                    </p>
                    <button
                        onClick={handleAccept}
                        className="flex-shrink-0 px-5 py-2 rounded-xl text-[13px] font-medium
                                   bg-white text-[#1C1A18] hover:bg-orange-500 hover:text-white
                                   transition-colors duration-200 active:scale-[0.98] whitespace-nowrap"
                    >
                        Ho capito
                    </button>
                </div>
            </div>
        </>
    );
}
