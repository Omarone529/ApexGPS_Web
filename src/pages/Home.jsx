// import './Home.css';
import RouteCarousel from '../components/RouteCarousel';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* HERO */}
      <section
        className="flex relative items-center overflow-hidden
                   min-h-screen w-screen"
      >
        <img
          src="/moto.webp"
          alt="Viaggio in moto"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#00000006] to-[#00000002]" />

        <div className="relative z-1 pl-16 max-w-xl">
          <h1 className="text-6xl m-0">Scopri percorsi panoramici</h1>
          <p className="mt-4 text-2xl opacity-85">Viaggia meglio. Non più veloce.</p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/planner"
              className="py-3.5 px-7 rounded-full border-none text-white cursor-pointer
                         bg-orange-500 text-base inline-flex items-center justify-center"
            >
              Pianifica un percorso
            </Link>

            <button
              className="py-3.5 px-7 rounded-full bg-transparent border border-white/60
                         text-white cursor-pointer"
              type="button"
              onClick={() => {
                document
                  .getElementById('nearby-routes')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Scopri ApexGPS
            </button>
          </div>
        </div>
      </section>

      {/* 🔥 GIRI IN MOTO */}
      <section id="nearby-routes">
        <RouteCarousel />
      </section>

      {/* VALUE PROPOSITION */}
      <section className="py-24 px-16 max-w-6xl mx-auto text-center my-0">
        <h2 className="text-4xl mb-16">
          Non il percorso più veloce.
          <br />
          Il percorso più bello.
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8">
          <div className="p-8 rounded-2xl bg-white/4">
            <h3 className="mb-3">🏔 Scenic score</h3>
            <p>Ogni strada viene valutata in base a panorama e contesto naturale.</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/4">
            <h3 className="mb-3">🛣 Curve & dislivelli</h3>
            <p>Più curve, meno traffico. Percorsi pensati per la moto.</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/4">
            <h3 className="mb-3">🏍 Moto-first</h3>
            <p>ApexGPS è progettato per chi guida, non per chi corre.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
