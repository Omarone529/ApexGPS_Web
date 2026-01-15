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

      setTimeout(() => {
        setFeedback({ show: false, message: '', type: '' });
      }, 3000);
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
    <div className="bg-[0a0a0a] min-h-screen text-white">
      <Feedback feedback={feedback} />

      <div
        className="h-[30vh] min-h-52 flex flex-col justify-center bg-linear-to-br from-[1a1a1a] to-[#2d1b00]
                      px-6 md:px-8 lg:px-12 xl:px-16"
      >
        <h1 className="text-[2rem] md:text-[5vh] lg:text[5vh] xl:text-5xl">
          Pianifica il tuo percorso
        </h1>
        <p className="mt-3 text-base md:text-[2vh] lg:text[2vh] xl:text-lg opacity-80">
          Crea itinerari panoramici personalizzati
        </p>
      </div>

      <div
        className="grid grid-cols-[minmax(320px,380px)_1fr] gap-8 py-8 px-6 md:px-[4vw] lg:px-[4vw] xl:px-12
                      max-w-[1600px] mx-auto my-0 items-start"
      >
        <PlannerForm
          form={form}
          updateForm={updateForm}
          handleAddWaypoint={handleAddWaypoint}
          isGenerating={isGenerating}
          handleGenerateRoute={handleGenerateRoute}
          routePoints={routePoints}
        />

        <div className="flex flex-col gap-6 min-w-0">
          <InteractiveMap routePoints={routePoints} />
          <RouteStats routePoints={routePoints} />
        </div>
      </div>
    </div>
  );
}

export default Planner;
