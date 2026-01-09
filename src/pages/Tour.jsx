// import React, {useEffect, useState} from 'react';
import React from "react";
import './Tour.css';

function Tour() {
    return (
        <>
            <section className="tour">
                <h1>TOUR</h1>
                <section id="nearby-routes" className="routes">
                    <RoutesGrid />
                </section>
            </section>
        </>
    );
}

function RoutesGrid() {

    // const [routesApi, setRoutes] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    // const [totalItems, setTotalItems] = useState(0);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const itemsPerPage = 20;

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

    // Get difficulty color
    const getDifficultyColor = (difficulty) => {
        const colors = {
            'Panoramico': '#4CAF50',    // Green
            'Sportivo': '#2196F3',      // Blue
            'Iconico': '#9C27B0',       // Purple
            'Lungo': '#FF9800',         // Orange
            'Epico': '#F44336',         // Red
            'Leggendario': '#FF4081',   // Pink
            'Spettacolare': '#00BCD4',  // Cyan
            'Scorrevole': '#3F51B5',    // Indigo
            'Tecnico': '#795548'        // Brown
        };
        return colors[difficulty] || '#757575';
    };

    // useEffect(() => {
    //     const fetchRoutes = async () => {
    //         try {
    //             setLoading(true);
    //
    //             //FIXME need updated api
    //             const response = await fetch('http://replaceWithApi.com');
    //
    //             if (!response.ok) {
    //                 throw new Error('HTTP error! status: ' + response.status);
    //             }
    //
    //             const data = await response.json();
    //             setRoutes(data.data || data.items || data);
    //             setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));
    //             setTotalItems(data.total);

    //         } catch (err) {
    //             setError(err.message);
    //             console.error('error fetching routes', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchRoutes();
    // }, [currentPage]);
    //

    // // Paginazoione
    // const PaginationControls = () => (
    //     <div className="pagination">
    //         <button className={`pagination-btn ${currentPage === 1 ? 'disabled' : '' }`}>Precedente</button>
    //
    //         <span className="page-numbers">
    //             {Array.from({ length: Math.min(5, totalPages)}, (_, i) => {
    //                 let pageNum;
    //                 if (totalPages <= 5){
    //                     pageNum = i +1;
    //                 } else if (currentPage <= 3) {
    //                     pageNum = i + 1;
    //                 } else if (currentPage >= totalPages - 2) {
    //                     pageNum = totalPages - 4 + i;
    //                 } else {
    //                     pageNum = currentPage - 2 + i;
    //                 }
    //
    //                 return (
    //                     <button key={pageNum} className={`pagination-btn ${currentPage === pageNum ? 'active' : '' }`}
    //                             onClick={() => handlePageChange(pageNum)}>
    //                         {pageNum}
    //                     </button>
    //                 );
    //             })}
    //         </span>
    //
    //         <button className={`pagination-btn ${currentPage === totalPages ? 'disabled' : '' }`}
    //                 onClick={() => handlePageChange(currentPage + 1)}
    //                 disabled={currentPage === totalPages}>
    //             Successiva
    //         </button>
    //     </div>
    // );

    // if (loading) {
    //     return (
    //         <div className="routes-container">
    //             <div className="loading-state">
    //                 <div className="spinner" role="status">
    //                     <p>In cerca di percorsi interessanti...</p>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
    // if (error) {
    //     return (
    //         <div className="routes-container">
    //             <div className="error-state">
    //                 <p>Errore nel caricamento: {error}</p>
    //                 <button className="button" onClick={() => window.location.reload()}>Prova di nuovo</button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="routes-container">
            {/* Header */}
            <div className="routes-header">
                <h2 className="routes-title">I percorsi più amati dagli utenti</h2>
                <span className="total-routes">{routes.length} percorsi</span>
            </div>

            {/* Grid */}
            <div className="routes-grid">
                {routes.map(route => (
                    <div key={route.id} className="route-card">
                        {/* Image */}
                        <img
                            src={route.image}
                            alt={route.title}
                            className="route-image"
                        />

                        {/* Overlay */}
                        <div className="route-overlay"></div>

                        {/* Main Title (disappears on hover) */}
                        <div className="route-main-title">
                            <h3>{route.title}</h3>
                        </div>

                        {/* Hidden Info (appears on hover) */}
                        <div className="route-info">
                            <div className="badge" style={{ backgroundColor: getDifficultyColor(route.difficulty) }}>
                                {route.difficulty}
                            </div>
                            <div className="route-details">
                                <h3>{route.title}</h3>
                                <p className="route-area">{route.area}</p>
                                <div className="route-footer">
                                    <div className="rating">
                                        <span className="stars">
                                          {[...Array(5)].map((_, i) => (
                                              <span
                                                  key={i}
                                                  className="star"
                                                  style={{ color: i < Math.floor(route.rating) ? '#FFD700' : '#ffffff80' }}
                                              >
                                              ★
                                            </span>
                                          ))}
                                        </span>
                                        <span className="rating-number">{route.rating.toFixed(1)}</span>
                                    </div>
                                    <button className="view-details-btn">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tour;