const RouteStats = ({ routePoints }) => {
    const hasRoute = routePoints.length > 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h4 className="mb-5 text-base font-medium text-white">Statistiche percorso</h4>

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-3">
                <div className="rounded-lg bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10">
                    <span className="mb-1 block text-xs text-white/60">Distanza</span>
                    <span className="text-lg font-semibold text-white">
                        {hasRoute ? '120 km' : '-- km'}
                    </span>
                </div>

                <div className="rounded-lg bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10">
                    <span className="mb-1 block text-xs text-white/60">Durata</span>
                    <span className="text-lg font-semibold text-white">
                        {hasRoute ? '2.5 h' : '-- h'}
                    </span>
                </div>

                <div className="rounded-lg bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10">
                    <span className="mb-1 block text-xs text-white/60">Dislivello</span>
                    <span className="text-lg font-semibold text-white">
                        {hasRoute ? '+850 m' : '-- m'}
                    </span>
                </div>

                <div className="rounded-lg bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10">
                    <span className="mb-1 block text-xs text-white/60">Scenic Score</span>
                    <span className="text-lg font-semibold text-white">
                        {hasRoute ? '8.5/10' : '--/10'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RouteStats;
