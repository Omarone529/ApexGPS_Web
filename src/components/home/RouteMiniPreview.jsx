import { useRef, useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';

export default function RouteMiniPreview() {
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    const [dot, setDot] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 85%', 'end 45%'],
    });

    const progress = useTransform(scrollYProgress, v => 1 - v);

    const d = `M969 0L919 134C907.606 167.332 900.56 179.842 887.5 207C874.44 234.158 846.984 265.203 788.5 317.973C730.016 370.742 743.44 404.56 716.5 410.973C689.56 417.385 674.881 413.838 648.5 423.726C624.359 436.02 611.442 439.41 589.5 439.226C569.092 437.953 561.914 438.142 538.5 427L488 415.5C459.264 402.416 376 400 376 400C376 400 346.02 396.008 334 395C321.98 393.992 227.5 406 227.5 406C227.5 406 177 421 170.5 434C164 447 147.761 456.188 139 456.5C131.258 457.584 122 447 122 447C122 447 111.232 431.653 120 418C128.768 404.347 161.819 387.801 192.5 377C223.616 366.046 271.747 341.463 281.5 332.5C291.253 323.537 308.798 313.734 328 307.853C339.991 304.181 351.146 307.593 367.5 304.33C385.344 302.614 399.398 299.935 409 301.5C437.336 306.117 505.789 312.77 516 307.574C526.211 302.378 528.496 293.88 515 283.574C501.504 273.268 473.5 275.5 473.5 275.5C477.684 275.392 398.89 276.319 365 268.5C331.11 260.681 311.947 268.366 307.5 273.5C303.053 278.634 224.764 307.508 202 310.5C179.236 313.492 166.963 314.555 139 310.5C100.281 304.885 56.2729 316.847 45 326.5C43.1221 325.233 29.4137 333.931 21 343.5C12.5863 353.069 7.30124 357.855 2.5 367.5`;

    useEffect(() => {
        const unsub = progress.on('change', v => {
            const path = pathRef.current;
            if (!path) return;

            const t = Math.max(0, Math.min(1, v));
            const len = path.getTotalLength();
            const p = path.getPointAtLength(len * t);
            setDot({ x: p.x, y: p.y });
        });

        return () => unsub();
    }, [progress]);

    useEffect(() => {
        const path = pathRef.current;
        if (!path) return;
        const len = path.getTotalLength();
        const p0 = path.getPointAtLength(len);
        setDot({ x: p0.x, y: p0.y });
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full max-w-2xl rounded-3xl border border-black/10 bg-[#EDE9DE] overflow-hidden"
        >
            <div className="p-5">
                <div className="relative w-full aspect-5/3 rounded-2xl overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/routes/topo.webp')" }}
                    />

                    <div className="absolute inset-0 bg-black/10" />

                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 1000 600"
                        preserveAspectRatio="none"
                    >
                        <motion.path
                            d={d}
                            fill="none"
                            stroke="rgba(0,0,0,0.35)"
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                pathLength: scrollYProgress,
                                pathOffset: progress,
                                pathSpacing: 1,
                            }}
                        />

                        <motion.path
                            ref={pathRef}
                            d={d}
                            fill="none"
                            stroke="rgba(255,107,0,0.92)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                pathLength: scrollYProgress,
                                pathOffset: progress,
                                pathSpacing: 1,
                            }}
                        />

                        <g transform={`translate(${dot.x} ${dot.y})`}>
                            <motion.circle
                                r="18"
                                fill="rgba(255,255,255,0.12)"
                                animate={{ r: [18, 24, 18], opacity: [0.25, 0.55, 0.25] }}
                                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <circle r="6.5" fill="rgba(255,255,255,0.95)" />
                            <circle
                                r="10.5"
                                fill="none"
                                stroke="rgba(0,0,0,0.18)"
                                strokeWidth="3"
                            />
                        </g>
                    </svg>

                    <div className="absolute left-2 bottom-20 h-9 w-9 rounded-full grid place-items-center font-bold bg-emerald-300/20 border border-emerald-300/35">
                        A
                    </div>

                    <div className="absolute right-5 top-5 h-9 w-9 rounded-full grid place-items-center font-bold bg-orange-300/20 border border-orange-300/35">
                        B
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-baseline gap-2 text-xs text-[#1C1A18]/80">
                    <span>Scenic score</span>
                    <strong className="text-sm text-[#1C1A18]">92</strong>
                    <span className="opacity-50">•</span>
                    <span>Curve</span>
                    <strong className="text-sm text-[#1C1A18]">Alte</strong>
                </div>
            </div>
        </div>
    );
}
