import RouteCarousel from '../components/home/RouteCarousel';
import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import RouteMiniPreview from '../components/home/RouteMiniPreview';

function Home() {
    const videoRef = useRef(null);

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

                <div className="relative z-10 px-6 sm:px-10 md:px-16 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
                        Scopri percorsi panoramici
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-white/85">
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

                <section className="px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-24">
                    <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-[#1C1A18]">
                                Pianifica il percorso perfetto
                            </h2>

                            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#1C1A18] max-w-xl">
                                ApexGPS nasce per la moto: calcola percorsi panoramici privilegiando
                                strade belle da guidare, curve e contesti naturali. Tu scegli
                                l’obiettivo, noi ottimizziamo il piacere di guida.
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

                <section className="mt-16 md:mt-24 px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-24">
                    {' '}
                    <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
                        <div className="order-2 lg:order-1 flex justify-center lg:justify-start lg:-ml-12">
                            <img
                                src="/planner-mockup-desktop.png"
                                alt="Mockup Planner ApexGPS"
                                className="w-full max-w-205 h-auto"
                                draggable={false}
                            />
                        </div>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-[#1C1A18]">
                                Trova l’ispirazione giusta
                            </h2>

                            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#1C1A18] max-w-xl">
                                Scopri strade panoramiche e giri consigliati nella tua zona. Filtra
                                per stile di guida e scegli se preferire panorama, curve o un mix
                                bilanciato.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={scrollToNearby}
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           bg-orange-500 text-white hover:bg-orange-600 transition"
                                >
                                    Esplora percorsi
                                </button>

                                <Link
                                    to="/planner"
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           border border-white/60 text-[#1C1A18] hover:bg-white/10 transition"
                                >
                                    Pianifica ora
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-16 md:mt-24 px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-24">
                    {' '}
                    <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-[#1C1A18]">
                                Salva, riparti, condividi
                            </h2>

                            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#1C1A18] max-w-xl">
                                Salva i tuoi giri preferiti e condividili con gli amici. ApexGPS è
                                pensato per chi viaggia per piacere: meno stress, più strada bella.
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
                           border border-white/60 text-[#1C1A18] hover:bg-white/10 transition"
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
