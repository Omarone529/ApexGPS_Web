import { useRef, useEffect } from "react";
import "./RouteCarousel.css";

const routes = [
  { id: 1, title: "Passo della Futa", area: "Appennino Tosco-Emiliano", difficulty: "Panoramico", rating: 4.8, image: "/routes/routes1.webp" },
  { id: 2, title: "Passo della Raticosa", area: "Bologna – Firenze", difficulty: "Sportivo", rating: 4.9, image: "/routes/routes2.webp" },
  { id: 3, title: "Muraglione", area: "Foreste Casentinesi", difficulty: "Iconico", rating: 4.7, image: "/routes/routes3.webp" },
  { id: 4, title: "Passo della Cisa", area: "Appennino Parmense", difficulty: "Lungo", rating: 4.6, image: "/routes/routes4.webp" },
  { id: 5, title: "Passo del Gavia", area: "Alpi Lombarde", difficulty: "Epico", rating: 4.9, image: "/routes/routes5.webp" },
  { id: 6, title: "Passo dello Stelvio", area: "Alpi Retiche", difficulty: "Leggendario", rating: 5.0, image: "/routes/routes6.webp" },
  { id: 7, title: "Passo Giau", area: "Dolomiti", difficulty: "Spettacolare", rating: 4.9, image: "/routes/routes7.webp" },
  { id: 8, title: "Colle delle Finestre", area: "Val di Susa", difficulty: "Epico", rating: 4.8, image: "/routes/routes8.webp" },
  { id: 9, title: "Passo del Rombo", area: "Alpi Venoste", difficulty: "Panoramico", rating: 4.9, image: "/routes/routes9.webp" },
  { id: 10, title: "Passo del Tonale", area: "Lombardia – Trentino", difficulty: "Scorrevole", rating: 4.6, image: "/routes/routes10.webp" },
  { id: 11, title: "Passo San Marco", area: "Val Brembana", difficulty: "Tecnico", rating: 4.7, image: "/routes/routes11.webp" },
];

// 🔁 DUPLICAZIONE
const loopRoutes = [...routes, ...routes];

function RouteCarousel() {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const translateX = useRef(0);

  useEffect(() => {
    // partiamo a metà
    const half = trackRef.current.scrollWidth / 2;
    translateX.current = -half / 2;
    trackRef.current.style.transform = `translateX(${translateX.current}px)`;
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    trackRef.current.classList.add("dragging");
  };

  const onMouseUp = () => {
    isDragging.current = false;
    trackRef.current.classList.remove("dragging");
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;

    const dx = e.clientX - startX.current;
    startX.current = e.clientX;
    translateX.current += dx;

    const trackWidth = trackRef.current.scrollWidth / 2;

    // 🔁 RESET INVISIBILE
    if (translateX.current > 0) {
      translateX.current = -trackWidth;
    } else if (translateX.current < -trackWidth * 2) {
      translateX.current = -trackWidth;
    }

    trackRef.current.style.transform = `translateX(${translateX.current}px)`;
  };

  return (
    <section className="routes">
      <div className="routes-header">
        <h2>Giri in moto panoramici vicino a te</h2>
      </div>

      <div
        className="routes-viewport"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="routes-track" ref={trackRef}>
          {loopRoutes.map((r, i) => (
            <div className="route-card" key={`${r.id}-${i}`}>
              <img src={r.image} alt={r.title} draggable="false" />
              <div className="route-overlay" />
              <div className="route-info">
                <span className="badge">{r.difficulty}</span>
                <h3>{r.title}</h3>
                <p>{r.area}</p>
                <span className="rating">⭐ {r.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RouteCarousel;
