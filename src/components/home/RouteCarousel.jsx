import { useRef, useEffect } from 'react';
// import './RouteCarousel.css';

const routes = [
  {
    id: 1,
    title: 'Passo della Futa',
    area: 'Appennino Tosco-Emiliano',
    difficulty: 'Panoramico',
    rating: 4.8,
    image: '/routes/routes1.webp',
  },
  {
    id: 2,
    title: 'Passo della Raticosa',
    area: 'Bologna – Firenze',
    difficulty: 'Sportivo',
    rating: 4.9,
    image: '/routes/routes2.webp',
  },
  {
    id: 3,
    title: 'Muraglione',
    area: 'Foreste Casentinesi',
    difficulty: 'Iconico',
    rating: 4.7,
    image: '/routes/routes3.webp',
  },
  {
    id: 4,
    title: 'Passo della Cisa',
    area: 'Appennino Parmense',
    difficulty: 'Lungo',
    rating: 4.6,
    image: '/routes/routes4.webp',
  },
  {
    id: 5,
    title: 'Passo del Gavia',
    area: 'Alpi Lombarde',
    difficulty: 'Epico',
    rating: 4.9,
    image: '/routes/routes5.webp',
  },
  {
    id: 6,
    title: 'Passo dello Stelvio',
    area: 'Alpi Retiche',
    difficulty: 'Leggendario',
    rating: 5.0,
    image: '/routes/routes6.webp',
  },
  {
    id: 7,
    title: 'Passo Giau',
    area: 'Dolomiti',
    difficulty: 'Spettacolare',
    rating: 4.9,
    image: '/routes/routes7.webp',
  },
  {
    id: 8,
    title: 'Colle delle Finestre',
    area: 'Val di Susa',
    difficulty: 'Epico',
    rating: 4.8,
    image: '/routes/routes8.webp',
  },
  {
    id: 9,
    title: 'Passo del Rombo',
    area: 'Alpi Venoste',
    difficulty: 'Panoramico',
    rating: 4.9,
    image: '/routes/routes9.webp',
  },
  {
    id: 10,
    title: 'Passo del Tonale',
    area: 'Lombardia – Trentino',
    difficulty: 'Scorrevole',
    rating: 4.6,
    image: '/routes/routes10.webp',
  },
  {
    id: 11,
    title: 'Passo San Marco',
    area: 'Val Brembana',
    difficulty: 'Tecnico',
    rating: 4.7,
    image: '/routes/routes11.webp',
  },
];

// doppia copia per anello vero
const loopRoutes = [...routes, ...routes];

function RouteCarousel() {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const offset = useRef(0);
  const singleWidth = useRef(1);

  useEffect(() => {
    const el = trackRef.current;

    const updateWidth = () => {
      const w = el.scrollWidth / 2;
      singleWidth.current = w > 1 ? w : 1;

      const wrapped =
        ((offset.current % singleWidth.current) + singleWidth.current) % singleWidth.current;

      el.style.transform = `translateX(${-wrapped}px)`;
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
    trackRef.current.classList.add('dragging');
    e.preventDefault();
  };

  const onMouseUp = () => {
    isDragging.current = false;
    trackRef.current.classList.remove('dragging');
  };

  const onMouseMove = e => {
    if (!isDragging.current) return;

    const dx = e.clientX - startX.current;
    startX.current = e.clientX;

    offset.current -= dx;

    const w = singleWidth.current || 1;
    const wrapped = ((offset.current % w) + w) % w;

    trackRef.current.style.transform = `translateX(${-wrapped}px)`;
  };

  return (
    <section className="py-16 px-8 bg-[radial-gradient(circle_at_top,#1c1c1c,#0e0e0e)] text-white overflow-hidden">
      <div className="mb-10">
        <h2 className="m-0 text-[clamp(2.2rem,3.2vw,2.8rem)] font-semibold leading-tight text-[#f2f2f2]">
          Percorsi panoramici vicino a te
        </h2>
      </div>

      <div
        className="overflow-hidden cursor-grab select-none active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="flex gap-7 will-change-transform p-4" ref={trackRef}>
          {loopRoutes.map((r, i) => (
            <div
              className="group relative w-85 h-115 rounded-3xl overflow-hidden shrink-0
                            transition-all duration-600 ease hover:-translate-y-2.5
                            hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              key={`${r.id}-${i}`}
            >
              <img
                className="w-full h-full object-cover pointer-events-none transition-transform duration-900 ease
                              group-hover:scale-110"
                src={r.image}
                alt={r.title}
                draggable="false"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 to-black/15" />
              <div
                className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-3.5 transition-all
                              duration-500 ease group-hover:opacity-100 group-hover:translate-y-0"
              >
                <span className="bg-white/18 py-1 px-3 rounded-full">{r.difficulty}</span>
                <h3 className="my-2 mx-0">{r.title}</h3>
                <p className="text-base opacity-80">{r.area}</p>
                <span className="text-base opacity-90">⭐ {r.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RouteCarousel;
