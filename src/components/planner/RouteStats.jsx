import './RouteStats.css';

const RouteStats = ({ routePoints }) => {
    return (
        <div className="stats-card">
            <h4>Statistiche percorso</h4>
            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-label">Distanza</span>
                    <span className="stat-value">{routePoints.length ? '120 km' : '-- km'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Durata</span>
                    <span className="stat-value">{routePoints.length ? '2.5 h' : '-- h'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Dislivello</span>
                    <span className="stat-value">{routePoints.length ? '+850 m' : '-- m'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Scenic Score</span>
                    <span className="stat-value">{routePoints.length ? '8.5/10' : '--/10'}</span>
                </div>
            </div>
        </div>
    );
};

export default RouteStats;