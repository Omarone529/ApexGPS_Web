// src/components/layout/Footer.jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaFacebook } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

export default function Footer() {
    const columns = useMemo(
        () => [
            {
                key: 'explore',
                title: 'Esplora',
                items: [
                    { label: 'Percorsi', to: '/' },
                    { label: 'Planner', to: '/planner' },
                    { label: 'Strade panoramiche', to: '/' },
                    { label: 'Curve migliori', to: '/' },
                    { label: 'Bikepacking', to: '/' },
                ],
            },
            {
                key: 'b2b',
                title: 'B2B',
                items: [
                    { label: 'Partner', to: '/partner' },
                    { label: 'Connect', to: '/connect' },
                    { label: 'Percorsi integrati', to: '/integrations' },
                ],
            },
            {
                key: 'company',
                title: 'Azienda',
                items: [
                    { label: 'Chi siamo', to: '/' },
                    { label: 'Novità', to: '/' },
                    { label: 'Ambassador', to: '/' },
                    { label: 'Aggiornamenti', to: '/' },
                ],
            },
            {
                key: 'community',
                title: 'Comunità',
                items: [
                    { label: 'Guide pratiche', to: '/guides' },
                    { label: 'Centro assistenza', to: '/support' },
                    { label: 'Community', to: '/community' },
                ],
            },
        ],
        []
    );

    const [openKey, setOpenKey] = useState('');

    return (
        <footer className="relative text-white">
            <div className="absolute inset-0 bg-black" />

            <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-12 lg:py-16">
                {/* Logo */}
                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center">
                        <img
                            src="/ApexGPS_logo.png"
                            alt="ApexGPS Logo"
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="hidden lg:grid lg:grid-cols-4 gap-x-28">
                    {columns.map(c => (
                        <FooterColumn key={c.key} title={c.title} items={c.items} />
                    ))}
                </div>

                <div className="lg:hidden">
                    <div className="divide-y divide-white/10">
                        {columns.map(c => (
                            <AccordionSection
                                key={c.key}
                                title={c.title}
                                isOpen={openKey === c.key}
                                onToggle={() => setOpenKey(prev => (prev === c.key ? '' : c.key))}
                            >
                                <ul className="pb-5 pt-2 space-y-3">
                                    {c.items.map(it => (
                                        <li key={it.label}>
                                            <Link
                                                to={it.to}
                                                className="text-white/70 hover:text-white transition"
                                            >
                                                {it.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionSection>
                        ))}
                    </div>
                </div>

                <div className="mt-12" />

                <div className="hidden lg:grid lg:grid-cols-4 gap-x-28 items-start">
                    <div className="col-span-2">
                        <h4 className="text-2xl font-semibold tracking-tight">Scarica l’app</h4>

                        <div className="mt-6 flex gap-4">
                            <a
                                href="https://apps.apple.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block hover:opacity-90 transition"
                            >
                                <img
                                    src="/badges/appstore-it.svg"
                                    alt="Scarica su App Store"
                                    className="h-11 w-auto"
                                />
                            </a>

                            <a
                                href="https://play.google.com/store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block hover:opacity-90 transition"
                            >
                                <img
                                    src="/badges/googleplay-it.svg"
                                    alt="Disponibile su Google Play"
                                    className="h-11 w-auto"
                                />
                            </a>
                        </div>
                    </div>

                    <div />

                    <div>
                        <h4 className="text-2xl font-semibold tracking-tight">
                            Seguici sui social
                        </h4>

                        <div className="mt-6 flex gap-4">
                            <SocialIcon
                                label="Instagram"
                                href="https://www.instagram.com/"
                                icon={<FaInstagram />}
                            />
                            <SocialIcon
                                label="YouTube"
                                href="https://www.youtube.com/"
                                icon={<FaYoutube />}
                            />
                            <SocialIcon
                                label="Facebook"
                                href="https://www.facebook.com/"
                                icon={<FaFacebook />}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 lg:hidden">
                    <h4 className="text-2xl font-semibold tracking-tight">Seguici sui social</h4>

                    <div className="mt-6 flex gap-4">
                        <SocialIcon
                            label="Instagram"
                            href="https://www.instagram.com/"
                            icon={<FaInstagram />}
                        />

                        <SocialIcon
                            label="YouTube"
                            href="https://www.youtube.com/"
                            icon={<FaYoutube />}
                        />

                        <SocialIcon
                            label="Facebook"
                            href="https://www.facebook.com/"
                            icon={<FaFacebook />}
                        />
                    </div>
                </div>

                <div className="mt-14" />

                {/* Bottom */}
                <div className="grid gap-6 lg:grid-cols-12 items-end text-sm text-white/60">
                    <div className="lg:col-span-3">© {new Date().getFullYear()} ApexGPS</div>

                    <div className="lg:col-span-7 flex flex-wrap gap-x-2 gap-y-1">
                        <Link to="/privacy">Privacy</Link> ·<Link to="/terms">Termini</Link> ·
                        <Link to="/cookies">Cookie</Link> ·<Link to="/community">Community</Link> ·
                        <Link to="/security">Security</Link> ·<Link to="/imprint">Note legali</Link>
                    </div>

                    <div className="lg:col-span-2 lg:flex lg:justify-end">
                        <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 hover:bg-white/15">
                            Italiano <FiChevronDown />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, items }) {
    return (
        <div>
            <h4 className="text-xl font-semibold">{title}</h4>
            <ul className="mt-5 space-y-3 text-white/70">
                {items.map(item => (
                    <li key={item.label}>
                        <Link to={item.to} className="hover:text-white">
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function AccordionSection({ title, isOpen, onToggle, children }) {
    return (
        <div className="py-6">
            <button onClick={onToggle} className="w-full flex justify-between items-center">
                <span className="text-3xl font-semibold">{title}</span>
                <FiChevronDown className={`transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && <div className="mt-3">{children}</div>}
        </div>
    );
}

function SocialIcon({ icon, href, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl
                 hover:bg-white/15 transition"
        >
            {icon}
        </a>
    );
}
