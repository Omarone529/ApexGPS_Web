import { useState } from 'react';
// import './Planner.css';
import PlannerForm from '../components/planner/PlannerForm';
import InteractiveMap from '../components/planner/InteractiveMap';
import RouteStats from '../components/planner/RouteStats';
import Feedback from '../components/planner/Feedback';

function Planner() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    start: '',
    end: '',
    waypoints: [''],
    isPublic: false,
  });
  const [routePoints, setRoutePoints] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleGenerateRoute = () => {
    if (!form.start || !form.end) {
      setFeedback({
        show: true,
        message: 'Inserisci almeno partenza e arrivo',
        type: 'error',
      });
      setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 3000);
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setRoutePoints([
        [45.4642, 9.19],
        [45.5, 9.2],
        [45.55, 9.25],
        [45.6, 9.3],
      ]);
      setFeedback({
        show: true,
        message: 'Percorso generato! Visualizza sulla mappa',
        type: 'success',
      });
      setIsGenerating(false);

      setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 3000);
    }, 1500);
  };

  const handleAddWaypoint = () => {
    updateForm('waypoints', [...form.waypoints, '']);
    setFeedback({
      show: true,
      message: 'Tappa aggiunta con successo!',
      type: 'waypoint',
    });
    setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Feedback feedback={feedback} />

      <div className="flex min-h-52 h-[30vh] flex-col justify-center bg-linear-to-br from-[#1a1a1a] to-[#2d1b00] px-6 md:px-8 lg:px-12 xl:px-16">
        <h1 className="m-0 text-[2rem] font-semibold md:text-[5vh] lg:text-[5vh] xl:text-5xl">
          Pianifica il tuo percorso
        </h1>
        <p className="mt-3 text-base opacity-80 md:text-[2vh] lg:text-[2vh] xl:text-lg">
          Crea itinerari panoramici personalizzati
        </p>
      </div>

      <div className="mx-auto grid max-w-400 grid-cols-[minmax(320px,380px)_1fr] items-start gap-8 px-6 py-8 md:px-[4vw] lg:px-[4vw] xl:px-12 max-[1200px]:grid-cols-1 max-[1200px]:gap-6 max-[1200px]:p-6 max-[768px]:gap-4 max-[768px]:p-4">
        <PlannerForm
          form={form}
          updateForm={updateForm}
          handleAddWaypoint={handleAddWaypoint}
          isGenerating={isGenerating}
          handleGenerateRoute={handleGenerateRoute}
          routePoints={routePoints}
        />

        <div className="flex min-w-0 flex-col gap-6">
          <InteractiveMap routePoints={routePoints} />
          <RouteStats routePoints={routePoints} />
        </div>
      </div>
    </div>
  );
}

export default Planner;
