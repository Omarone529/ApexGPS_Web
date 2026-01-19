import RouteCarousel from '../components/RouteCarousel';
import { Link } from 'react-router-dom';

function Home() {
  const scrollToNearby = () => {
    document
      .getElementById('nearby-routes')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center">
        <img
          src="/moto.webp"
          alt="Viaggio in moto"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* overlay */}
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

      {/* CAROUSEL */}
      <section id="nearby-routes" className="scroll-mt-24">
        <RouteCarousel />
      </section>

      {/* FEATURE 1 */}
      <section className="px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Pianifica il percorso perfetto
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85 max-w-xl">
              ApexGPS nasce per la moto: calcola percorsi panoramici privilegiando strade belle da
              guidare, curve e contesti naturali. Tu scegli l’obiettivo, noi ottimizziamo il piacere
              di guida.
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
                           border border-white/60 text-white hover:bg-white/10 transition"
              >
                Vedi percorsi vicino a te
              </button>
            </div>
          </div>

          <div className="grid gap-4 justify-items-start lg:justify-items-end">
            {/* mock map */}
            <div className="w-full max-w-105 rounded-2xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur">
              <div className="p-4">
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
                                bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.10),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]"
                >
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
                  <div className="h-1 w-[70%] rounded-full bg-orange-500/70 -rotate-18" />
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

            {/* mock photo */}
            <div
              className="w-full max-w-90 h-56 rounded-2xl border border-white/10 bg-white/6
                            shadow-2xl shadow-black/40 overflow-hidden opacity-90
                            bg-[linear-gradient(135deg,rgba(255,107,0,0.22),transparent_40%),url('/moto.webp')] bg-center bg-cover"
            ></div>
          </div>
        </div>
      </section>

      {/* FEATURE 2 (reverse) */}
      <section className="px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* media first on desktop */}
          <div className="order-2 lg:order-1 grid gap-4 justify-items-start">
            <div className="w-full max-w-105 rounded-2xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur">
              <div className="p-4">
                <div className="rounded-xl bg-black/35 border border-white/10 px-4 py-3 text-sm text-white/90">
                  Cerca luoghi o percorsi…
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-500/20 border border-orange-500/35 px-3 py-2 text-xs">
                    Panorama
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs">Curve</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs">Bilanciato</span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    ['Distanza', '120 km'],
                    ['Tempo', '2h 10m'],
                    ['Scenic', '🔥 88'],
                  ].map(([t, v]) => (
                    <div key={t} className="rounded-xl bg-white/6 border border-white/10 p-3">
                      <div className="text-[11px] text-white/70">{t}</div>
                      <div className="mt-1 font-semibold">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="w-full max-w-90 h-60 rounded-2xl border border-white/10 bg-white/6
                            shadow-2xl shadow-black/40 overflow-hidden opacity-90
                            bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.55)),url('/moto.webp')] bg-center bg-cover"
            ></div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Trova l’ispirazione giusta
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85 max-w-xl">
              Scopri strade panoramiche e giri consigliati nella tua zona. Filtra per stile di guida
              e scegli se preferire panorama, curve o un mix bilanciato.
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
                           border border-white/60 text-white hover:bg-white/10 transition"
              >
                Pianifica ora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 3 */}
      <section className="px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Salva, riparti, condividi
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85 max-w-xl">
              Salva i tuoi giri preferiti e condividili con gli amici. ApexGPS è pensato per chi
              viaggia per piacere: meno stress, più strada bella.
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
                           border border-white/60 text-white hover:bg-white/10 transition"
              >
                Torna su
              </button>
            </div>
          </div>

          <div className="grid gap-4 justify-items-start lg:justify-items-end">
            <div className="w-full max-w-105 rounded-2xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur">
              <div className="p-4">
                <div
                  className="h-56 rounded-2xl overflow-hidden
                                bg-[linear-gradient(135deg,rgba(255,107,0,0.22),transparent_40%),url('/moto.webp')] bg-center bg-cover"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs">✅ Salvato</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs">🔗 Condividi</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs">⭐ 4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
