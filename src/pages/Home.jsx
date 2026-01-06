import "./Home.css";
import RouteCarousel from "../components/RouteCarousel";
import { Link } from "react-router-dom";

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
                  .getElementById("nearby-routes")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <section className="value">
        <h2>
          Non il percorso più veloce.
          <br />
          Il percorso più bello.
        </h2>

        <div className="value-cards">
          <div className="value-card">
            <h3>🏔 Scenic score</h3>
            <p>
              Ogni strada viene valutata in base a panorama e contesto naturale.
            </p>
          </div>

          <div className="value-card">
            <h3>🛣 Curve & dislivelli</h3>
            <p>Più curve, meno traffico. Percorsi pensati per la moto.</p>
          </div>

          <div className="value-card">
            <h3>🏍 Moto-first</h3>
            <p>ApexGPS è progettato per chi guida, non per chi corre.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
