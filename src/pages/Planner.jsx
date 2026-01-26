import { useState } from 'react';
import InteractiveMap from '../components/planner/InteractiveMap';
import PlannerForm from '../components/planner/PlannerForm';

const Planner = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [calculatedRoute, setCalculatedRoute] = useState([]);
    const [isScenicRoute, setIsScenicRoute] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCalculateRoute = formData => {
        console.log('Calcolo percorso standard con:', formData);
        setIsScenicRoute(false);

        //TODO andrà messa la chiamata API qui
        const mockRoute = [
            [45.4642, 9.19],
            [45.4742, 9.2],
            [45.4842, 9.21],
        ];
        setCalculatedRoute(mockRoute);
    };

    const handleCalculateScenicRoute = formData => {
        console.log('Calcolo percorso panoramico con:', formData);
        setIsScenicRoute(true);

        const scenicRoute = [
            [45.4642, 9.19],
            [45.4692, 9.195],
            [45.4742, 9.1975],
            [45.4792, 9.205],
            [45.4842, 9.21],
        ];
        setCalculatedRoute(scenicRoute);

        // TODO: Implementare qui la chiamata al backend per il percorso panoramico
    };

    const handleSaveRoute = formData => {
        console.log('Salvataggio percorso:', formData);
        const routeType = isScenicRoute ? 'panoramico' : 'standard';
        alert(
            `Percorso ${routeType} salvato!\nPartenza: ${formData.startPoint}\nArrivo: ${formData.endPoint}\nTappe: ${formData.waypoints.filter(w => w).length}`
        );
    };

    return (
        <div className="relative h-screen">
            <InteractiveMap
                onMenuToggle={handleMenuToggle}
                routePoints={[]}
                calculatedRoute={calculatedRoute}
            />

            <PlannerForm
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onCalculateRoute={handleCalculateRoute}
                onCalculateScenicRoute={handleCalculateScenicRoute} // Nuova prop
                onSaveRoute={handleSaveRoute}
            />
        </div>
    );
};

export default Planner;
