import "./Home.css";

function Home() {
  return (
    <section className="hero">
      <img
        src="/moto.webp"
        alt="Viaggio in moto"
        className="hero-img"
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>Scopri percorsi panoramici</h1>
        <p>Viaggia meglio. Non più veloce.</p>
      </div>
    </section>
  );
}

export default Home;
