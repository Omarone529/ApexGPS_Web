import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const lexend = { fontFamily: "'Lexend', sans-serif" };

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('apexgps_cookies_accepted');
        if (!accepted) {
            const t = setTimeout(() => setVisible(true), 800);
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
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
            role="region"
            aria-label="Informativa cookie"
        >
            <div
                className="mx-auto max-w-2xl bg-[#1C1A18] rounded-2xl px-5 py-4
                           flex flex-col sm:flex-row items-start sm:items-center gap-4
                           shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
                style={lexend}
            >
                <p className="flex-1 text-[13px] text-white/70 leading-relaxed font-light">
                    Usiamo solo cookie tecnici necessari al funzionamento del sito.{' '}
                    <Link
                        to="/cookies"
                        className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
                    >
                        Scopri di più
                    </Link>
                    .
                </p>

                <button
                    onClick={handleAccept}
                    className="flex-shrink-0 px-5 py-2 rounded-xl text-[13px] font-medium
                               bg-orange-500 text-white hover:bg-orange-600
                               transition-colors duration-200 active:scale-[0.98] whitespace-nowrap"
                >
                    Ho capito
                </button>
            </div>
        </div>
    );
}
