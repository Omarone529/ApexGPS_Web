import { useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import sunAnimation from '../../assets/animations/sun.lottie';

const routes = [
    {
        id: 1,
        title: 'Passo della Futa',
        area: 'Appennino Tosco-Emiliano',
        difficulty: 'Panoramico',
        rating: 4.8,
        users: 444,
        time: '03:55',
        distance: '11,1 km',
        elevation: '330 m',
        image: '/routes/routes1.webp',
    },
    {
        id: 2,
        title: 'Passo della Raticosa',
        area: 'Bologna – Firenze',
        difficulty: 'Sportivo',
        rating: 4.9,
        users: 510,
        time: '02:40',
        distance: '92 km',
        elevation: '1.120 m',
        image: '/routes/routes2.webp',
    },
    {
        id: 3,
        title: 'Muraglione',
        area: 'Foreste Casentinesi',
        difficulty: 'Iconico',
        rating: 4.7,
        users: 417,
        time: '02:15',
        distance: '78 km',
        elevation: '980 m',
        image: '/routes/routes3.webp',
    },
    {
        id: 4,
        title: 'Passo della Cisa',
        area: 'Appennino Parmense',
        difficulty: 'Lungo',
        rating: 4.6,
        users: 336,
        time: '03:10',
        distance: '135 km',
        elevation: '1.450 m',
        image: '/routes/routes4.webp',
    },
    {
        id: 5,
        title: 'Passo del Gavia',
        area: 'Alpi Lombarde',
        difficulty: 'Epico',
        rating: 4.9,
        users: 289,
        time: '04:05',
        distance: '164 km',
        elevation: '2.100 m',
        image: '/routes/routes5.webp',
    },
    {
        id: 6,
        title: 'Passo dello Stelvio',
        area: 'Alpi Retiche',
        difficulty: 'Leggendario',
        rating: 5.0,
        users: 612,
        time: '04:40',
        distance: '182 km',
        elevation: '2.450 m',
        image: '/routes/routes6.webp',
    },
    {
        id: 7,
        title: 'Passo Giau',
        area: 'Dolomiti',
        difficulty: 'Spettacolare',
        rating: 4.9,
        users: 398,
        time: '03:25',
        distance: '128 km',
        elevation: '1.900 m',
        image: '/routes/routes7.webp',
    },
    {
        id: 8,
        title: 'Colle delle Finestre',
        area: 'Val di Susa',
        difficulty: 'Epico',
        rating: 4.8,
        users: 271,
        time: '03:50',
        distance: '144 km',
        elevation: '2.000 m',
        image: '/routes/routes8.webp',
    },
    {
        id: 9,
        title: 'Passo del Rombo',
        area: 'Alpi Venoste',
        difficulty: 'Panoramico',
        rating: 4.9,
        users: 355,
        time: '03:35',
        distance: '152 km',
        elevation: '1.750 m',
        image: '/routes/routes9.webp',
    },
    {
        id: 10,
        title: 'Passo del Tonale',
        area: 'Lombardia – Trentino',
        difficulty: 'Scorrevole',
        rating: 4.6,
        users: 190,
        time: '02:55',
        distance: '118 km',
        elevation: '1.200 m',
        image: '/routes/routes10.webp',
    },
    {
        id: 11,
        title: 'Passo San Marco',
        area: 'Val Brembana',
        difficulty: 'Tecnico',
        rating: 4.7,
        users: 244,
        time: '03:05',
        distance: '126 km',
        elevation: '1.600 m',
        image: '/routes/routes11.webp',
    },
];

const loopRoutes = [...routes, ...routes];

export default function RouteCarousel() {
    const trackRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const offset = useRef(0);
    const singleWidth = useRef(1);

    const touchStartX = useRef(0);
    const touchStartOffset = useRef(0);

    const applyTransform = () => {
        const el = trackRef.current;
        if (!el) return;

        const w = singleWidth.current || 1;
        const wrapped = ((offset.current % w) + w) % w;
        el.style.transform = `translateX(${-wrapped}px)`;
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        const updateWidth = () => {
            const w = el.scrollWidth / 2;
            singleWidth.current = w > 1 ? w : 1;
            applyTransform();
        };

        updateWidth();

        const ro = new ResizeObserver(updateWidth);
        ro.observe(el);
        window.addEventListener('resize', updateWidth);

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    const onMouseDown = e => {
        isDragging.current = true;
        startX.current = e.clientX;
        trackRef.current?.classList.add('dragging');
        e.preventDefault();
    };

    const onMouseUp = () => {
        isDragging.current = false;
        trackRef.current?.classList.remove('dragging');
    };

    const onMouseMove = e => {
        if (!isDragging.current) return;

        const dx = e.clientX - startX.current;
        startX.current = e.clientX;

        offset.current -= dx;
        applyTransform();
    };

    const onWheel = e => {
        if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) return;

        e.preventDefault();
        offset.current += e.deltaX;
        applyTransform();
    };

    const onTouchStart = e => {
        if (!e.touches?.length) return;

        isDragging.current = true;
        trackRef.current?.classList.add('dragging');

        touchStartX.current = e.touches[0].clientX;
        touchStartOffset.current = offset.current;
    };

    const onTouchMove = e => {
        if (!isDragging.current || !e.touches?.length) return;

        e.preventDefault();
        const x = e.touches[0].clientX;
        const dx = x - touchStartX.current;

        offset.current = touchStartOffset.current - dx;
        applyTransform();
    };

    const onTouchEnd = () => {
        isDragging.current = false;
        trackRef.current?.classList.remove('dragging');
    };

    return (
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 px-6 sm:px-10 md:px-16 bg-[#F5F3EC] text-gray-900 overflow-hidden">
            {/* Title block (Komoot-like) + Lottie vicino al titolo */}
            <div className="mb-18">
                <button
                    type="button"
                    className="inline-flex items-center gap-3 text-orange-600 font-semibold tracking-tight leading-[0.95]
                     text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                    Mototurismo
                    <span className="translate-y-1 opacity-90">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10"
                        >
                            <path
                                d="M6 9l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="2.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </button>

                {/* wrapper relativo: la Lottie NON crea spazi strani */}
                <div className="relative mt-4">
                    <h2
                        className="text-[#141414] font-semibold tracking-tight leading-[0.95]
                       text-[2.6rem] sm:text-[3.2rem] md:text-[3.6rem] lg:text-[3.5rem] xl:text-[3.6rem]"
                    >
                        percorsi vicino a te
                    </h2>
                    <div className="hidden md:block absolute left-120 top-[40%] -translate-y-1/2 opacity-95">
                        {/* Lottie (desktop) posizionata vicino al titolo, tipo Komoot */}

                        <DotLottieReact
                            src={sunAnimation}
                            loop
                            autoplay
                            speed={0.7}
                            className="w-28 h-28 lg:w-32 lg:h-32"
                        />
                    </div>
                </div>

                {/* spacer equivalente al paragrafo + margine */}
                <div className="mt-18 sm:mt-20 md:mt-24" />
            </div>

            {/* Track */}
            <div
                className="overflow-hidden cursor-grab select-none active:cursor-grabbing"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onWheel={onWheel}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}
            >
                <div className="flex gap-7 will-change-transform p-4" ref={trackRef}>
                    {loopRoutes.map((r, i) => (
                        <div
                            key={`${r.id}-${i}`}
                            className="group relative w-85 h-105 rounded-3xl overflow-hidden shrink-0
                         border border-black/10 bg-white shadow-none
                         transition-transform duration-500 ease-out
                         hover:-translate-y-2 hover:-rotate-1"
                        >
                            <img
                                className="w-full h-full object-cover pointer-events-none transition-transform duration-900 ease group-hover:scale-110"
                                src={r.image}
                                alt={r.title}
                                draggable="false"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/85 to-black/15 transition-opacity duration-500 ease-out group-hover:opacity-0" />
                            <div className="absolute inset-0 bg-[#EDE9DE] transition-opacity duration-500 ease-out opacity-0 group-hover:opacity-100" />

                            <div className="absolute top-4 left-4 z-10">
                                <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-medium text-white border border-white/20 transition-colors duration-500 ease-out group-hover:text-[#1C1A18] group-hover:bg-black/0 group-hover:border-black/10">
                                    {r.difficulty}
                                </span>
                            </div>

                            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 text-white text-sm font-semibold transition-colors duration-500 ease-out group-hover:text-[#1C1A18]">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 inline-flex justify-start">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                            />
                                        </svg>
                                    </span>
                                    <span>{String(r.rating).replace('.', ',')}</span>
                                </div>

                                <div className="flex items-center gap-2 opacity-90">
                                    <span className="w-5 inline-flex justify-start">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                            />
                                        </svg>
                                    </span>
                                    <span>{r.users}</span>
                                </div>
                            </div>

                            <div className="absolute left-6 top-20 z-10 opacity-0 translate-y-1 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 text-[#1C1A18]">
                                <div className="flex flex-col gap-3 text-base font-semibold">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-70">⏱</span>
                                        <span>{r.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-70">↔</span>
                                        <span>{r.distance}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-70">↗</span>
                                        <span>{r.elevation}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 z-10 transition-colors duration-500 ease-out">
                                <h3 className="text-3xl font-semibold leading-tight text-white group-hover:text-[#1C1A18]">
                                    {r.title}
                                </h3>
                                <p className="mt-2 text-sm text-white/85 group-hover:text-[#1C1A18]/80">
                                    {r.area}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
