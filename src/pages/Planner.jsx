import { useState } from 'react';
import './Planner.css';
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
    <div className="planner-page">
      <Feedback feedback={feedback} />

      <div className="planner-hero">
        <h1>Pianifica il tuo percorso</h1>
        <p>Crea itinerari panoramici personalizzati</p>
      </div>

      <div className="planner-content">
        <PlannerForm
          form={form}
          updateForm={updateForm}
          handleAddWaypoint={handleAddWaypoint}
          isGenerating={isGenerating}
          handleGenerateRoute={handleGenerateRoute}
          routePoints={routePoints}
        />

        <div className="planner-map-area">
          <InteractiveMap routePoints={routePoints} />
          <RouteStats routePoints={routePoints} />
        </div>
      </div>
    </div>
  );
}

export default Planner;
