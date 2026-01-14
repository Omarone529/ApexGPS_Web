import './Home.css';
import RouteCarousel from '../components/RouteCarousel';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <img src="/moto.webp" alt="Viaggio in moto" className="hero-img" />

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Scopri percorsi panoramici</h1>
          <p>Viaggia meglio. Non più veloce.</p>

          <div className="hero-actions">
            <Link to="/planner" className="btn-primary">
              Pianifica un percorso
            </Link>

            <button
              className="btn-secondary"
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
      {/* FEATURE SECTIONS (stile komoot) */}
      <section className="feature">
        <div className="feature-inner">
          <div className="feature-text">
            <h2>Pianifica il percorso perfetto</h2>
            <p>
              ApexGPS nasce per la moto: calcola percorsi panoramici
              privilegiando strade belle da guidare, curve e contesti naturali.
              Tu scegli l’obiettivo, noi ottimizziamo il piacere di guida.
            </p>

            <div className="feature-actions">
              <Link to="/planner" className="btn-primary">
                Apri il Planner
              </Link>

              <button
                className="btn-secondary"
                type="button"
                onClick={() =>
                  document
                    .getElementById("nearby-routes")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                Vedi percorsi vicino a te
              </button>
            </div>
          </div>

          <div className="feature-media">
            <div className="mock-card mock-map">
              <div className="mock-top">
                <span className="pill">Passo della Futa</span>
                <span className="pill ghost">Panoramico</span>
              </div>

              <div className="mock-route">
                <div className="dot a">A</div>
                <div className="line" />
                <div className="dot b">B</div>
              </div>

              <div className="mock-bottom">
                <span>Scenic score</span>
                <strong>92</strong>
                <span className="sep">•</span>
                <span>Curve</span>
                <strong>Alte</strong>
              </div>
            </div>

            <div className="mock-card mock-photo" />
          </div>
        </div>
      </section>

      <section className="feature feature--reverse">
        <div className="feature-inner">
          <div className="feature-text">
            <h2>Trova l’ispirazione giusta</h2>
            <p>
              Scopri strade panoramiche e giri consigliati nella tua zona.
              Filtra per stile di guida e scegli se preferire panorama, curve o
              un mix bilanciato.
            </p>

            <div className="feature-actions">
              <button
                className="btn-primary"
                type="button"
                onClick={() =>
                  document
                    .getElementById("nearby-routes")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                Esplora percorsi
              </button>

              <Link to="/planner" className="btn-secondary">
                Pianifica ora
              </Link>
            </div>
          </div>

          <div className="feature-media">
            <div className="mock-card mock-search">
              <div className="search-bar">Cerca luoghi o percorsi…</div>

              <div className="filters">
                <span className="chip active">Panorama</span>
                <span className="chip">Curve</span>
                <span className="chip">Bilanciato</span>
              </div>

              <div className="mini-stats">
                <div className="mini">
                  <div className="mini-title">Distanza</div>
                  <div className="mini-value">120 km</div>
                </div>
                <div className="mini">
                  <div className="mini-title">Tempo</div>
                  <div className="mini-value">2h 10m</div>
                </div>
                <div className="mini">
                  <div className="mini-title">Scenic</div>
                  <div className="mini-value">🔥 88</div>
                </div>
              </div>
            </div>

            <div className="mock-card mock-road" />
          </div>
        </div>
      </section>

      <section className="feature">
        <div className="feature-inner">
          <div className="feature-text">
            <h2>Salva, riparti, condividi</h2>
            <p>
              Salva i tuoi giri preferiti e condividili con gli amici. ApexGPS è
              pensato per chi viaggia per piacere: meno stress, più strada
              bella.
            </p>

            <div className="feature-actions">
              <Link to="/planner" className="btn-primary">
                Crea un giro
              </Link>

              <button
                className="btn-secondary"
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Torna su
              </button>
            </div>
          </div>

          <div className="feature-media">
            <div className="mock-card mock-stack">
              <div className="stack-img" />
              <div className="stack-row">
                <span className="chip">✅ Salvato</span>
                <span className="chip">🔗 Condividi</span>
                <span className="chip">⭐ 4.8</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
