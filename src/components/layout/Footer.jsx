import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

function PanoramicIllustration() {
    return (
        <div aria-hidden="true" style={{ lineHeight: 0, width: '100%', overflow: 'hidden' }}>
            <style>{`
        /* ─── NUVOLE: vento da sx → dx ─── */
        @keyframes cloud-a {
          0%   { transform: translateX(-240px); }
          100% { transform: translateX(1680px); }
        }
        @keyframes cloud-b {
          0%   { transform: translateX(-380px); }
          100% { transform: translateX(1680px); }
        }
        @keyframes cloud-c {
          0%   { transform: translateX(-500px); }
          100% { transform: translateX(1680px); }
        }
        .sc-cloud-a { animation: cloud-a 60s linear infinite; }
        .sc-cloud-b { animation: cloud-b 80s linear infinite 10s; }
        .sc-cloud-c { animation: cloud-c 100s linear infinite 25s; }

        /* ─── UCCELLI: stessa direzione vento, più veloci ─── */
        @keyframes birds {
          0%   { transform: translateX(-100px); opacity: 0; }
          4%   { opacity: 1; }
          94%  { opacity: 1; }
          100% { transform: translateX(1600px); opacity: 0; }
        }
        /* Nessun delay: entrano subito e ciclano */
        .sc-birds-1 { animation: birds 16s ease-in-out infinite; }
        /* Secondo stormo offset di metà ciclo */
        .sc-birds-2 { animation: birds 16s ease-in-out infinite 8s; }

        /* ─── MOTO: traversata con pausa ─── */
        /*
         * Ciclo 35s:
         *  0%–25%  → traversata (≈8.5s), sale lungo la strada
         *  25%–100% → fuori scena (pausa 26s)
         */
        @keyframes moto {
          0%   { transform: translate(-100px, 6px);   opacity: 0; }
          3%   { transform: translate(-20px,  5px);   opacity: 1; }
          25%  { transform: translate(1520px, -40px); opacity: 1; }
          26%  { transform: translate(1520px, -40px); opacity: 0; }
          100% { transform: translate(1520px, -40px); opacity: 0; }
        }
        .sc-moto { animation: moto 35s linear infinite; }

        /* ─── RUOTE MOTO: rotazione sincrona con velocità traversata ─── */
        @keyframes wheel {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* le ruote girano per tutta l'animazione ma sono visibili solo quando la moto è in scena */
        .sc-wheel { animation: wheel 0.4s linear infinite; transform-box: fill-box; transform-origin: center; }
      `}</style>

            <svg
                viewBox="0 0 1440 260"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                style={{ width: '100%', height: 'auto', display: 'block' }}
            >
                <defs>
                    <linearGradient id="sc-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#b8d4e8" />
                        <stop offset="40%" stopColor="#ddb98a" />
                        <stop offset="75%" stopColor="#e8c49a" />
                        <stop offset="100%" stopColor="#c4896a" />
                    </linearGradient>
                    <radialGradient id="sc-sun" cx="62%" cy="72%" r="28%">
                        <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.95" />
                        <stop offset="30%" stopColor="#f5c97a" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#e8905a" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="sc-mt-far" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8faec4" />
                        <stop offset="100%" stopColor="#6d92ad" />
                    </linearGradient>
                    <linearGradient id="sc-mt-mid" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6d8a78" />
                        <stop offset="100%" stopColor="#4a6355" />
                    </linearGradient>
                    <linearGradient id="sc-fg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#5a7a60" />
                        <stop offset="100%" stopColor="#3d5542" />
                    </linearGradient>
                    <linearGradient id="sc-road" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8a9a92" stopOpacity="0" />
                        <stop offset="10%" stopColor="#8a9a92" />
                        <stop offset="90%" stopColor="#8a9a92" />
                        <stop offset="100%" stopColor="#8a9a92" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="sc-mist" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e8d8c8" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#e8d8c8" stopOpacity="0" />
                    </linearGradient>
                    <filter id="sc-blur">
                        <feGaussianBlur stdDeviation="1.8" />
                    </filter>
                </defs>

                {/* CIELO */}
                <rect width="1440" height="260" fill="url(#sc-sky)" />
                <rect width="1440" height="260" fill="url(#sc-sun)" />

                {/* NUVOLE */}
                <g className="sc-cloud-a">
                    <ellipse
                        cx="240"
                        cy="54"
                        rx="95"
                        ry="20"
                        fill="white"
                        opacity="0.52"
                        filter="url(#sc-blur)"
                    />
                    <ellipse
                        cx="282"
                        cy="44"
                        rx="58"
                        ry="15"
                        fill="white"
                        opacity="0.62"
                        filter="url(#sc-blur)"
                    />
                    <ellipse
                        cx="195"
                        cy="60"
                        rx="50"
                        ry="13"
                        fill="white"
                        opacity="0.42"
                        filter="url(#sc-blur)"
                    />
                </g>
                <g className="sc-cloud-b">
                    <ellipse
                        cx="700"
                        cy="36"
                        rx="112"
                        ry="21"
                        fill="white"
                        opacity="0.42"
                        filter="url(#sc-blur)"
                    />
                    <ellipse
                        cx="752"
                        cy="27"
                        rx="66"
                        ry="15"
                        fill="white"
                        opacity="0.52"
                        filter="url(#sc-blur)"
                    />
                    <ellipse
                        cx="645"
                        cy="42"
                        rx="62"
                        ry="13"
                        fill="white"
                        opacity="0.36"
                        filter="url(#sc-blur)"
                    />
                </g>
                <g className="sc-cloud-c">
                    <ellipse
                        cx="1180"
                        cy="26"
                        rx="80"
                        ry="16"
                        fill="white"
                        opacity="0.35"
                        filter="url(#sc-blur)"
                    />
                    <ellipse
                        cx="1220"
                        cy="18"
                        rx="46"
                        ry="11"
                        fill="white"
                        opacity="0.44"
                        filter="url(#sc-blur)"
                    />
                </g>

                {/* MONTAGNE LONTANE */}
                <path
                    d="M0,190 L60,148 L110,162 L180,120 L250,148 L320,108 L400,138 L470,95 L550,128 L630,105 L710,132 L790,98 L870,125 L950,90 L1030,118 L1110,94 L1190,120 L1270,100 L1360,122 L1440,105 L1440,260 L0,260 Z"
                    fill="url(#sc-mt-far)"
                    opacity="0.7"
                />
                {/* Neve */}
                <path
                    d="M180,120 L196,133 L212,126 L228,138 L250,148Z"
                    fill="white"
                    opacity="0.58"
                />
                <path
                    d="M320,108 L336,122 L352,115 L366,126 L400,138Z"
                    fill="white"
                    opacity="0.54"
                />
                <path
                    d="M470,95  L484,108 L498,101 L512,112 L550,128Z"
                    fill="white"
                    opacity="0.58"
                />
                <path
                    d="M790,98  L804,111 L818,104 L832,115 L870,125Z"
                    fill="white"
                    opacity="0.54"
                />
                <path
                    d="M950,90  L963,103 L977,97  L990,108 L1030,118Z"
                    fill="white"
                    opacity="0.58"
                />
                <path
                    d="M1110,94 L1123,107 L1137,100 L1150,110 L1190,120Z"
                    fill="white"
                    opacity="0.54"
                />

                {/* NEBBIA VALLE */}
                <ellipse cx="420" cy="196" rx="280" ry="30" fill="url(#sc-mist)" />
                <ellipse cx="980" cy="200" rx="220" ry="25" fill="url(#sc-mist)" />

                {/* MONTAGNE MEDIE */}
                <path
                    d="M0,230 L50,200 L100,215 L170,185 L240,208 L310,178 L380,200 L450,170 L520,195 L580,178 L640,205 L700,188 L760,215 L820,192 L880,210 L950,180 L1020,202 L1090,175 L1160,198 L1230,178 L1300,200 L1370,182 L1440,200 L1440,260 L0,260 Z"
                    fill="url(#sc-mt-mid)"
                />

                {/* COLLINE PRIMO PIANO */}
                <path
                    d="M0,248 Q200,228 400,238 Q600,248 720,235 Q900,220 1100,235 Q1300,250 1440,238 L1440,260 L0,260 Z"
                    fill="url(#sc-fg)"
                />

                {/* STRADA */}
                <path
                    d="M-10,260 Q150,245 320,240 Q500,234 640,235 Q780,236 920,228 Q1060,220 1220,218 Q1340,217 1450,210"
                    fill="none"
                    stroke="url(#sc-road)"
                    strokeWidth="9"
                />
                {/* mezzeria */}
                <path
                    d="M-10,260 Q150,245 320,240 Q500,234 640,235 Q780,236 920,228 Q1060,220 1220,218 Q1340,217 1450,210"
                    fill="none"
                    stroke="#c8d0cc"
                    strokeWidth="1"
                    opacity="0.6"
                    strokeDasharray="20,14"
                />

                {/* PINI sinistra */}
                {[
                    [38, 248],
                    [54, 244],
                    [68, 250],
                ].map(([x, b], i) => (
                    <g key={`tl${i}`}>
                        <rect x={x - 1.5} y={b - 8} width="3" height="8" fill="#3a5040" />
                        <polygon
                            points={`${x},${b - 30} ${x - 9},${b - 8} ${x + 9},${b - 8}`}
                            fill="#4a6450"
                        />
                        <polygon
                            points={`${x},${b - 42} ${x - 7},${b - 22} ${x + 7},${b - 22}`}
                            fill="#4a6450"
                        />
                        <polygon
                            points={`${x},${b - 52} ${x - 5},${b - 36} ${x + 5},${b - 36}`}
                            fill="#567050"
                        />
                    </g>
                ))}
                {/* PINI centro */}
                {[
                    [682, 238],
                    [698, 234],
                    [714, 240],
                ].map(([x, b], i) => (
                    <g key={`tc${i}`}>
                        <rect x={x - 1.5} y={b - 8} width="3" height="8" fill="#3a5040" />
                        <polygon
                            points={`${x},${b - 26} ${x - 8},${b - 8} ${x + 8},${b - 8}`}
                            fill="#4a6450"
                        />
                        <polygon
                            points={`${x},${b - 38} ${x - 6},${b - 18} ${x + 6},${b - 18}`}
                            fill="#4a6450"
                        />
                    </g>
                ))}
                {/* PINI destra */}
                {[
                    [1362, 244],
                    [1380, 240],
                    [1398, 246],
                    [1414, 242],
                ].map(([x, b], i) => (
                    <g key={`tr${i}`}>
                        <rect x={x - 1.5} y={b - 8} width="3" height="8" fill="#3a5040" />
                        <polygon
                            points={`${x},${b - 28} ${x - 8},${b - 8} ${x + 8},${b - 8}`}
                            fill="#4a6450"
                        />
                        <polygon
                            points={`${x},${b - 40} ${x - 6},${b - 20} ${x + 6},${b - 20}`}
                            fill="#4a6450"
                        />
                        <polygon
                            points={`${x},${b - 50} ${x - 4},${b - 34} ${x + 4},${b - 34}`}
                            fill="#567050"
                        />
                    </g>
                ))}

                {/* ═══════════════════════════════════════
            UCCELLI — due stormi sfasati
            posizionati a y diverse per non collidere
        ═══════════════════════════════════════ */}
                <g className="sc-birds-1">
                    {/* stormo compatto, quota alta */}
                    <path
                        d="M0,65   Q5,60   10,65  Q15,60  20,65"
                        fill="none"
                        stroke="#5a6a80"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                    />
                    <path
                        d="M12,56  Q17,51  22,56  Q27,51  32,56"
                        fill="none"
                        stroke="#5a6a80"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                    />
                    <path
                        d="M-10,74 Q-5,69  0,74   Q5,69   10,74"
                        fill="none"
                        stroke="#5a6a80"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.65"
                    />
                    <path
                        d="M22,70  Q27,65  32,70  Q37,65  42,70"
                        fill="none"
                        stroke="#5a6a80"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.55"
                    />
                </g>
                <g className="sc-birds-2">
                    {/* stormo più largo, quota media */}
                    <path
                        d="M0,90   Q5,85   10,90  Q15,85  20,90"
                        fill="none"
                        stroke="#6a7888"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M14,82  Q19,77  24,82  Q29,77  34,82"
                        fill="none"
                        stroke="#6a7888"
                        strokeWidth="1"
                        strokeLinecap="round"
                    />
                    <path
                        d="M-6,98  Q-1,93  4,98   Q9,93   14,98"
                        fill="none"
                        stroke="#6a7888"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.6"
                    />
                    <path
                        d="M24,95  Q29,90  34,95  Q39,90  44,95"
                        fill="none"
                        stroke="#6a7888"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                        opacity="0.5"
                    />
                </g>

                {/* ═══════════════════════════════════════
            MOTO — realistica, animata
            Disegnata a x≈310, y≈235 (sulla strada)
        ═══════════════════════════════════════ */}
                <g className="sc-moto">
                    {/* ombra a terra */}
                    <ellipse cx="316" cy="243" rx="22" ry="3.5" fill="#3a4840" opacity="0.22" />

                    {/* RUOTA POSTERIORE */}
                    <g className="sc-wheel">
                        <circle
                            cx="300"
                            cy="237"
                            r="8"
                            fill="none"
                            stroke="#2a2e2c"
                            strokeWidth="2.5"
                        />
                        <circle cx="300" cy="237" r="3" fill="#3a3e3c" />
                        {/* raggi */}
                        <line
                            x1="300"
                            y1="229"
                            x2="300"
                            y2="245"
                            stroke="#3a3e3c"
                            strokeWidth="1"
                        />
                        <line
                            x1="292"
                            y1="237"
                            x2="308"
                            y2="237"
                            stroke="#3a3e3c"
                            strokeWidth="1"
                        />
                        <line
                            x1="294"
                            y1="231"
                            x2="306"
                            y2="243"
                            stroke="#3a3e3c"
                            strokeWidth="0.8"
                        />
                        <line
                            x1="294"
                            y1="243"
                            x2="306"
                            y2="231"
                            stroke="#3a3e3c"
                            strokeWidth="0.8"
                        />
                    </g>

                    {/* RUOTA ANTERIORE */}
                    <g className="sc-wheel">
                        <circle
                            cx="334"
                            cy="237"
                            r="8"
                            fill="none"
                            stroke="#2a2e2c"
                            strokeWidth="2.5"
                        />
                        <circle cx="334" cy="237" r="3" fill="#3a3e3c" />
                        <line
                            x1="334"
                            y1="229"
                            x2="334"
                            y2="245"
                            stroke="#3a3e3c"
                            strokeWidth="1"
                        />
                        <line
                            x1="326"
                            y1="237"
                            x2="342"
                            y2="237"
                            stroke="#3a3e3c"
                            strokeWidth="1"
                        />
                        <line
                            x1="328"
                            y1="231"
                            x2="340"
                            y2="243"
                            stroke="#3a3e3c"
                            strokeWidth="0.8"
                        />
                        <line
                            x1="328"
                            y1="243"
                            x2="340"
                            y2="231"
                            stroke="#3a3e3c"
                            strokeWidth="0.8"
                        />
                    </g>

                    {/* TELAIO */}
                    {/* forcella anteriore */}
                    <line x1="326" y1="230" x2="318" y2="222" stroke="#4a5550" strokeWidth="2" />
                    <line x1="334" y1="229" x2="320" y2="221" stroke="#4a5550" strokeWidth="1.5" />
                    {/* corpo principale */}
                    <path
                        d="M300,232 L308,222 L320,220 L328,224 L334,229 L328,232 Z"
                        fill="#3e4e48"
                    />
                    {/* serbatoio */}
                    <path d="M306,228 L314,219 L322,220 L326,225 L318,228 Z" fill="#6a7e76" />
                    {/* codone */}
                    <path d="M300,232 L295,230 L292,233 L298,235 Z" fill="#4a5a54" />
                    {/* scarico */}
                    <path
                        d="M298,235 Q293,237 288,236"
                        fill="none"
                        stroke="#888"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    {/* manubrio */}
                    <line
                        x1="320"
                        y1="220"
                        x2="327"
                        y2="217"
                        stroke="#3a4a44"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <line
                        x1="327"
                        y1="217"
                        x2="330"
                        y2="220"
                        stroke="#3a4a44"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />

                    {/* PILOTA */}
                    {/* busto inclinato in avanti (guida sportiva) */}
                    <path
                        d="M313,226 Q316,214 320,212 L322,215 Q319,218 316,228 Z"
                        fill="#2a3832"
                    />
                    {/* gambe */}
                    <path
                        d="M308,230 Q310,236 305,237"
                        fill="none"
                        stroke="#2a3832"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M314,230 Q315,236 311,237"
                        fill="none"
                        stroke="#2a3832"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    {/* casco — con visiera */}
                    <circle cx="320" cy="210" r="6.5" fill="#1e2a26" />
                    <path
                        d="M315,208 Q317,205 323,207 L324,211 Q319,212 315,210 Z"
                        fill="#4a6a80"
                        opacity="0.7"
                    />
                    {/* mani sul manubrio */}
                    <circle cx="328" cy="218" r="2" fill="#2a3832" />
                </g>

                {/* GUARDRAIL */}
                <path
                    d="M-10,257 Q150,242 320,237 Q500,231 640,232 Q780,233 920,225 Q1060,217 1220,215 Q1340,214 1450,207"
                    fill="none"
                    stroke="#b8c4be"
                    strokeWidth="1.2"
                    opacity="0.5"
                    strokeDasharray="18,7"
                />
            </svg>
        </div>
    );
}

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
        <>
            <style>{`
        .apx-footer {
          background: #f0ebe4;
          color: #4a5a54;
          font-family: system-ui, -apple-system, sans-serif;
          overflow: hidden;
        }
        .apx-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 44px 48px 0;
        }
        .apx-top {
          display: flex;
          align-items: flex-start;
          gap: 72px;
          padding-bottom: 36px;
          border-bottom: 1px solid #d8d0c8;
        }
        .apx-logo {
          font-size: 20px;
          font-weight: 600;
          color: #2a3830;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          align-self: center;
        }
        .apx-columns { display: flex; gap: 56px; flex: 1; }
        .apx-col-title {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a9890;
          margin: 0 0 14px;
        }
        .apx-col-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 9px; }
        .apx-col-list a { font-size: 13px; color: #5a6e68; text-decoration: none; transition: color 0.15s; }
        .apx-col-list a:hover { color: #2a3830; }
        .apx-actions { display: flex; align-items: center; gap: 28px; padding: 24px 0 0; }
        .apx-actions span { font-size: 12px; color: #8a9890; letter-spacing: 0.06em; }
        .apx-accordion { display: none; }
        .apx-acc-item { border-bottom: 1px solid #d8d0c8; }
        .apx-acc-btn {
          width: 100%; padding: 16px 0; display: flex; justify-content: space-between;
          align-items: center; background: none; border: none; cursor: pointer;
          font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: #8a9890;
        }
        .apx-acc-icon { color: #5a6e68; transition: transform 0.25s; flex-shrink: 0; }
        .apx-acc-icon.open { transform: rotate(180deg); }
        .apx-acc-body { padding-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }
        .apx-acc-body a { font-size: 13px; color: #5a6e68; text-decoration: none; }
        .apx-curve { width: 100%; overflow: hidden; line-height: 0; margin-top: 16px; }
        .apx-bottom-bg { background: #e4ddd6; }
        .apx-bottom-wrap {
          max-width: 1280px; margin: 0 auto; padding: 18px 48px;
          display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .apx-bottom-left {
          font-size: 11px; color: #8a9890; letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .apx-bottom-left a { color: #8a9890; text-decoration: none; transition: color 0.15s; }
        .apx-bottom-left a:hover { color: #2a3830; }
        .apx-locale { font-size: 11px; color: #8a9890; letter-spacing: 0.1em; text-transform: uppercase; }
        @media (max-width: 820px) {
          .apx-inner { padding: 32px 24px 0; }
          .apx-top { flex-direction: column; gap: 20px; }
          .apx-columns { display: none; }
          .apx-accordion { display: block; width: 100%; }
          .apx-bottom-wrap { padding: 16px 24px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

            <footer className="apx-footer">
                <PanoramicIllustration />

                <div className="apx-inner">
                    <div className="apx-top">
                        <div className="apx-logo">ApexGPS</div>

                        <nav className="apx-columns" aria-label="Footer navigation">
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

                        <nav className="apx-accordion" aria-label="Footer navigation mobile">
                            {columns.map(col => (
                                <div key={col.key} className="apx-acc-item">
                                    <button
                                        className="apx-acc-btn"
                                        onClick={() =>
                                            setOpenKey(openKey === col.key ? '' : col.key)
                                        }
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

                    <div className="apx-actions">
                        <span>Scarica l'app</span>
                        <span>Seguici sui social</span>
                    </div>
                </div>

                <div className="apx-curve">
                    <svg
                        viewBox="0 0 1440 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'block', width: '100%' }}
                    >
                        <path
                            d="M0,12 Q360,24 720,12 Q1080,0 1440,12 L1440,24 L0,24 Z"
                            fill="#e4ddd6"
                        />
                    </svg>
                </div>

                <div className="apx-bottom-bg">
                    <div className="apx-bottom-wrap">
                        <div className="apx-bottom-left">
                            <span>© {new Date().getFullYear()} ApexGPS</span>
                            <span>·</span>
                            <a href="/privacy">Privacy</a>
                            <span>·</span>
                            <a href="/terms">Termini</a>
                            <span>·</span>
                            <a href="/cookies">Cookie</a>
                            <span>·</span>
                            <a href="/community">Community</a>
                        </div>
                        <div className="apx-locale">Italiano</div>
                    </div>
                </div>
            </footer>
        </>
    );
}
