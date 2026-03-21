import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

function WaveTransition() {
    return (
        <div aria-hidden="true" style={{ lineHeight: 0, width: '100%', overflow: 'hidden' }}>
            <svg
                viewBox="0 0 1440 140"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                style={{ width: '100%', display: 'block' }}
            >
                <rect width="1440" height="140" fill="#F5F3EC" />
                <path
                    d="M0,100 C240,40 480,130 720,80 C960,30 1200,110 1440,70 L1440,140 L0,140 Z"
                    fill="#3A3E3C"
                />
                <path
                    d="M0,115 C300,75 600,130 900,95 C1100,72 1300,108 1440,90 L1440,140 L0,140 Z"
                    fill="#343836"
                    opacity="0.7"
                />
            </svg>
        </div>
    );
}

const columns = [
    {
        key: 'explore',
        title: 'Esplora',
        items: [
            { label: 'Percorsi', to: '/tour' },
            { label: 'Tour', to: '/tour' },
            { label: 'Planner', to: '/planner' },
        ],
    },
];

export default function Footer() {
    const [openKey, setOpenKey] = useState('');

    return (
        <>
            <style>{`
                .apx-footer {
                    background: #3A3E3C;
                    font-family: 'Lexend', sans-serif;
                    overflow: hidden;
                }
                .apx-body {
                    max-width: 1440px;
                    margin: 0 auto;
                    padding: 52px 56px 40px;
                    display: flex;
                    gap: 80px;
                    align-items: flex-start;
                    border-bottom: 0.5px solid rgba(255,255,255,0.08);
                }
                .apx-brand-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #F0EDE8;
                    letter-spacing: -0.01em;
                }
                .apx-brand-tagline {
                    font-size: 12px;
                    color: rgba(255,255,255,0.35);
                    margin-top: 6px;
                    font-weight: 300;
                    letter-spacing: 0.03em;
                }
                .apx-nav {
                    display: flex;
                    gap: 64px;
                    flex: 1;
                }
                .apx-col-title {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    margin: 0 0 16px;
                }
                .apx-col-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .apx-col-list a {
                    font-size: 13px;
                    color: rgba(255,255,255,0.55);
                    text-decoration: none;
                    font-weight: 300;
                    transition: color 0.15s;
                }
                .apx-col-list a:hover { color: #F0EDE8; }
                .apx-bottom-wrap {
                    max-width: 1440px;
                    margin: 0 auto;
                    padding: 20px 56px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .apx-bottom-left {
                    font-size: 11px;
                    color: rgba(255,255,255,0.25);
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    font-weight: 300;
                    flex-wrap: wrap;
                }
                .apx-bottom-left a {
                    color: rgba(255,255,255,0.25);
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .apx-bottom-left a:hover { color: rgba(255,255,255,0.5); }
                .apx-locale {
                    font-size: 11px;
                    color: rgba(255,255,255,0.25);
                    font-weight: 300;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .apx-accordion { display: none; }
                .apx-acc-item { border-bottom: 0.5px solid rgba(255,255,255,0.08); }
                .apx-acc-btn {
                    width: 100%;
                    padding: 16px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    font-family: 'Lexend', sans-serif;
                }
                .apx-acc-icon { color: rgba(255,255,255,0.3); transition: transform 0.25s; }
                .apx-acc-icon.open { transform: rotate(180deg); }
                .apx-acc-body {
                    padding-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .apx-acc-body a {
                    font-size: 13px;
                    color: rgba(255,255,255,0.55);
                    text-decoration: none;
                    font-weight: 300;
                }
                @media (max-width: 820px) {
                    .apx-body { flex-direction: column; gap: 28px; padding: 36px 24px 28px; }
                    .apx-nav { display: none; }
                    .apx-accordion { display: block; width: 100%; }
                    .apx-bottom-wrap { padding: 16px 24px; flex-direction: column; align-items: flex-start; }
                }
                @media (max-width: 480px) {
                    .apx-body { padding: 28px 16px 24px; }
                    .apx-bottom-wrap { padding: 14px 16px; }
                }
            `}</style>

            <footer className="apx-footer">
                <WaveTransition />

                <div className="apx-body">
                    <div>
                        <div className="apx-brand-name">ApexGPS</div>
                        <div className="apx-brand-tagline">Viaggia meglio. Non più veloce.</div>
                    </div>

                    {/* Desktop nav */}
                    <nav className="apx-nav" aria-label="Footer navigation">
                        {columns.map(col => (
                            <div key={col.key}>
                                <p className="apx-col-title">{col.title}</p>
                                <ul className="apx-col-list">
                                    {col.items.map(item => (
                                        <li key={item.label}>
                                            <Link to={item.to}>{item.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* Mobile accordion */}
                    <nav className="apx-accordion" aria-label="Footer navigation mobile">
                        {columns.map(col => (
                            <div key={col.key} className="apx-acc-item">
                                <button
                                    className="apx-acc-btn"
                                    onClick={() => setOpenKey(openKey === col.key ? '' : col.key)}
                                    aria-expanded={openKey === col.key}
                                >
                                    {col.title}
                                    <FiChevronDown
                                        size={13}
                                        className={`apx-acc-icon ${openKey === col.key ? 'open' : ''}`}
                                    />
                                </button>
                                {openKey === col.key && (
                                    <div className="apx-acc-body">
                                        {col.items.map(item => (
                                            <Link key={item.label} to={item.to}>
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="apx-bottom-wrap">
                    <div className="apx-bottom-left">
                        <span>© {new Date().getFullYear()} ApexGPS</span>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Termini</Link>
                        <Link to="/cookies">Cookie</Link>
                    </div>
                    <div className="apx-locale">Italiano</div>
                </div>
            </footer>
        </>
    );
}
