import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import RouteCarousel from '../components/home/RouteCarousel';
import RouteMiniPreview from '../components/home/RouteMiniPreview';
import { apiFetch } from '../services/api';

function CountUp({ end, duration = 500 }) {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);
    const animatedRef = useRef(false);
    const animationRef = useRef(null);

    useEffect(() => {
        const resetCount = () => {
            if (!animatedRef.current) {
                setCount(0);
            }
        };
        resetCount();

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !animatedRef.current && end) {
                    animatedRef.current = true;
                    const startTime = performance.now();
                    const startValue = 0;
                    const endValue = end;
                    const totalDuration = duration;

                    const animate = currentTime => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / totalDuration, 1);
                        const currentCount = Math.floor(
                            startValue + (endValue - startValue) * progress
                        );
                        setCount(currentCount);

                        if (progress < 1) {
                            animationRef.current = requestAnimationFrame(animate);
                        } else {
                            setCount(endValue);
                            animationRef.current = null;
                        }
                    };

                    animationRef.current = requestAnimationFrame(animate);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            observer.disconnect();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [end, duration]);

    return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

function Home() {
    const videoRef = useRef(null);
    const [stats, setStats] = useState({ poi_count: null, segment_count: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const scrollToNearby = () => {
        document
            .getElementById('nearby-routes')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play();
        }

        apiFetch('/gis/stats/')
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <section
                id="hero"
                className="relative min-h-screen w-full overflow-hidden flex items-center"
            >
                <video
                    ref={videoRef}
                    src="/header-video.mp4"
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="auto"
                    disablePictureInPicture
                    disableRemotePlayback
                    className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                />

                <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/35 to-black/15" />

                <div className="relative z-10 px-6 sm:px-10 md:px-16 xl:px-24 max-w-2xl xl:max-w-3xl">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight">
                        Scopri percorsi panoramici
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl xl:text-2xl text-white/85">
                        Viaggia meglio. Non più veloce.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to="/planner"
                            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                         bg-orange-500 text-white hover:bg-orange-600 transition"
                        >
                            Pianifica un percorso
                        </Link>

                        <button
                            type="button"
                            onClick={scrollToNearby}
                            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                         border border-white/60 text-white hover:bg-white/10 transition"
                        >
                            Scopri ApexGPS
                        </button>
                    </div>
                </div>
            </section>

            <div className="bg-[#F5F3EC]">
                <section id="nearby-routes" className="scroll-mt-24">
                    <RouteCarousel />
                </section>

                <section className="px-6 sm:px-10 md:px-16 xl:px-24 py-16 sm:py-20 md:py-24 xl:py-32">
                    <div className="mx-auto max-w-6xl xl:max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 xl:gap-20 items-center">
                        <div>
                            <h2
                                className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] text-[#1C1A18]"
                                style={{ fontFamily: "'Lexend', sans-serif" }}
                            >
                                Pianifica.{' '}
                                <span className="text-orange-500 font-light tracking-[-0.01em]">
                                    Esplora.
                                </span>
                            </h2>

                            <p className="mt-5 text-base sm:text-lg xl:text-xl leading-relaxed text-[#1C1A18] max-w-xl xl:max-w-2xl">
                                Percorsi pensati per chi guida per piacere, non per arrivare.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    to="/planner"
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           bg-orange-500 text-white hover:bg-orange-600 transition"
                                >
                                    Apri il Planner
                                </Link>

                                <button
                                    type="button"
                                    onClick={scrollToNearby}
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                                    border border-[#E0DACB] bg-[#EDE9DE] text-[#1C1A18] hover:bg-[#E6E1D4] transition"
                                >
                                    Vedi percorsi vicino a te
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 justify-items-start lg:justify-items-end">
                            <RouteMiniPreview />
                        </div>
                    </div>
                </section>

                <section className="mt-16 md:mt-24 px-6 sm:px-10 md:px-16 xl:px-24 py-16 sm:py-20 md:py-24 xl:py-32">
                    {' '}
                    <div className="mx-auto max-w-6xl xl:max-w-7xl grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 xl:gap-20 items-center">
                        <div className="order-2 lg:order-1 flex justify-center lg:justify-start lg:-ml-12">
                            <img
                                src="/planner-mockup-desktop.png"
                                alt="Mockup Planner ApexGPS"
                                className="w-full max-w-205 h-auto"
                                draggable={false}
                            />
                        </div>

                        <div className="order-1 lg:order-2">
                            <div
                                className="order-1 lg:order-2"
                                style={{ fontFamily: "'Lexend', sans-serif" }}
                            >
                                <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] uppercase text-orange-600 mb-4">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span
                                            className="absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-40 animate-ping"
                                            style={{ animationDuration: '2.5s' }}
                                        />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-600" />
                                    </span>
                                    Live data
                                </span>

                                <h2
                                    className="text-4xl sm:text-5xl leading-[1.05] tracking-[-0.03em]
                                    text-[#1C1A18] mb-8 font-extrabold"
                                    style={{ fontFamily: "'Lexend', sans-serif" }}
                                >
                                    I dati che fanno la&nbsp;
                                    <span className="text-orange-600 font-light tracking-[-0.01em]">
                                        differenza
                                    </span>
                                </h2>

                                {loading ? (
                                    <p className="text-[#9A9590]">Caricamento dati...</p>
                                ) : error ? (
                                    <p className="text-[#9A9590]">Dati stradali non disponibili.</p>
                                ) : (
                                    <div className="flex gap-9 items-start">
                                        <div className="flex flex-col gap-1.5">
                                            <span
                                                className="text-[42px] sm:text-[46px] font-bold text-orange-600 leading-none tracking-[-0.03em]"
                                                style={{ fontFamily: "'Lexend', sans-serif" }}
                                            >
                                                <CountUp end={stats.poi_count} duration={1000} />
                                                <span className="text-[#1C1A18]">+</span>
                                            </span>
                                            <span className="text-[10px] font-semibold text-[#B0ABA4] uppercase tracking-[0.1em]">
                                                Punti di interesse
                                            </span>
                                        </div>
                                        <div className="w-px h-14 bg-[#E0DDD6] self-center" />
                                        <div className="flex flex-col gap-1.5">
                                            <span
                                                className="text-[42px] sm:text-[46px] font-bold text-orange-600 leading-none tracking-[-0.03em]"
                                                style={{ fontFamily: "'Lexend', sans-serif" }}
                                            >
                                                <CountUp
                                                    end={stats.segment_count}
                                                    duration={1000}
                                                />
                                                <span className="text-[#1C1A18]">+</span>
                                            </span>
                                            <span className="text-[10px] font-semibold text-[#B0ABA4] uppercase tracking-[0.1em]">
                                                Segmenti stradali
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    to="/tour"
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           bg-orange-500 text-white hover:bg-orange-600 transition"
                                >
                                    Esplora percorsi
                                </Link>

                                <Link
                                    to="/planner"
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           border border-[#E0DACB] bg-[#EDE9DE] text-[#1C1A18] hover:bg-[#E6E1D4] transition"
                                >
                                    Pianifica ora
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-16 md:mt-24 px-6 sm:px-10 md:px-16 xl:px-24 py-16 sm:py-20 md:py-24 xl:py-32">
                    {' '}
                    <div className="mx-auto max-w-6xl xl:max-w-7xl grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 xl:gap-20 items-center">
                        <div>
                            <h2
                                className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] text-[#1C1A18]"
                                style={{ fontFamily: "'Lexend', sans-serif" }}
                            >
                                Salva. Riparti.{' '}
                                <span className="text-orange-500 font-light tracking-[-0.01em]">
                                    Condividi.
                                </span>
                            </h2>

                            <p className="mt-5 text-base sm:text-lg xl:text-xl leading-relaxed text-[#1C1A18] max-w-xl xl:max-w-2xl">
                                I tuoi giri preferiti sempre a portata di mano, pronti da rivivere o
                                condividere con chi vuoi.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    to="/planner"
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           bg-orange-500 text-white hover:bg-orange-600 transition"
                                >
                                    Crea un giro
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           border border-[#E0DACB] bg-[#EDE9DE] text-[#1C1A18] hover:bg-[#E6E1D4] transition"
                                >
                                    Torna su
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center lg:justify-center">
                            <img
                                src="/planner-mockup-iphone.png"
                                alt="Mockup Planner ApexGPS su iPhone"
                                className="w-full max-w-60 h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.25)]"
                                draggable={false}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;
