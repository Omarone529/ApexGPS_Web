import { useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValueEvent } from 'framer-motion';

export default function RouteMiniPreview({ progress }) {
  const pathRef = useRef(null);
  const [dot, setDot] = useState({ x: 16, y: 46 });

  // Path più “panoramico”: più curve, anche U-turn
  const d = `M 16 48
           C 28 48  40 46  52 44
           C 66 42  74 38  78 32
           C 82 24  76 18  66 18
           C 56 18  54 26  62 28
           C 72 30  74 22  68 22
           C 60 22  56 30  60 36
           C 64 42  72 46  82 42
           C 90 38  90 28  84 22`;

  useMotionValueEvent(progress, 'change', v => {
    const path = pathRef.current;
    if (!path) return;

    const t = Math.max(0, Math.min(1, v));
    const len = path.getTotalLength();
    const p = path.getPointAtLength(len * t);

    setDot({ x: p.x, y: p.y });
  });

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="rounded-full bg-white/10 px-3 py-2 text-xs tracking-wide">
            Passo della Futa
          </span>
          <span className="rounded-full bg-orange-500/15 border border-orange-500/25 px-3 py-2 text-xs tracking-wide">
            Panoramico
          </span>
        </div>

        <div
          className="relative h-44 rounded-2xl grid place-items-center overflow-hidden
                     bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.16),transparent_45%),
                         radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_50%),
                         linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))]"
        >
          {/* Topografia */}
          <div className="absolute inset-0 opacity-[0.55] mix-blend-soft-light bg-[url('routes/topo.webp')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute inset-0 bg-black/5" />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
          >
            {/* Bordo scuro (asfalto) — sottile e pulito */}
            <motion.path
              d={d}
              fill="none"
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: progress }}
            />

            {/* Interno arancio (route) — ancora più sottile */}
            <motion.path
              ref={pathRef}
              d={d}
              fill="none"
              stroke="rgba(255,107,0,0.92)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: progress }}
            />

            {/* Marker: dot bianco + halo */}
            <g transform={`translate(${dot.x} ${dot.y})`}>
              {/* halo */}
              <motion.circle
                r="6.5"
                fill="rgba(255,255,255,0.12)"
                animate={{ r: [6.5, 9, 6.5], opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* dot */}
              <circle r="2.2" fill="rgba(255,255,255,0.95)" />
              {/* micro bordo per staccarlo dal topo */}
              <circle r="3.6" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            </g>
          </svg>

          {/* A / B */}
          <div
            className="absolute left-5 bottom-5 h-9 w-9 rounded-full grid place-items-center font-bold
                       bg-emerald-300/20 border border-emerald-300/35"
          >
            A
          </div>

          <div
            className="absolute right-5 top-5 h-9 w-9 rounded-full grid place-items-center font-bold
                       bg-orange-300/20 border border-orange-300/35"
          >
            B
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-2 text-xs text-white/90">
          <span>Scenic score</span>
          <strong className="text-sm">92</strong>
          <span className="opacity-50">•</span>
          <span>Curve</span>
          <strong className="text-sm">Alte</strong>
        </div>
      </div>
    </div>
  );
}
