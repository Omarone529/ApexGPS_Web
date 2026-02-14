import { useState } from 'react';
import {
  FiX,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiNavigation,
  FiSave,
  FiCamera,
  FiTarget,
  FiUser,
} from 'react-icons/fi';
import LocationInput from './LocationInput';

const PlannerForm = ({
  isOpen,
  onClose,
  onCalculateRoute,
  onSaveRoute,
  onCalculateScenicRoute,
}) => {
  const [formData, setFormData] = useState({
    startPoint: '',
    endPoint: '',
    waypoints: [''],
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScenicMode, setIsScenicMode] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWaypointChange = (index, value) => {
    const newWaypoints = [...formData.waypoints];
    newWaypoints[index] = value;
    setFormData(prev => ({ ...prev, waypoints: newWaypoints }));
  };

  const addWaypoint = () => {
    setFormData(prev => ({
      ...prev,
      waypoints: [...prev.waypoints, ''],
    }));
  };

  const removeWaypoint = index => {
    if (formData.waypoints.length > 1) {
      const newWaypoints = formData.waypoints.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, waypoints: newWaypoints }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleCalculate = async () => {
    if (!formData.startPoint || !formData.endPoint) {
      return;
    }

    setIsSubmitting(true);
    onClose();

    try {
      await onCalculateRoute?.(formData);
    } catch (error) {
      console.error('Errore nel calcolo del percorso:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculateScenic = async () => {
    if (!formData.startPoint || !formData.endPoint) {
      return;
    }

    setIsSubmitting(true);
    setIsScenicMode(true);
    onClose();

    try {
      await onCalculateScenicRoute?.(formData);
    } catch (error) {
      console.error('Errore nel calcolo del percorso panoramico:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!formData.startPoint || !formData.endPoint) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveRoute?.(formData);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    if (window.confirm('Vuoi cancellare tutti i dati inseriti?')) {
      setFormData({
        startPoint: '',
        endPoint: '',
        waypoints: [''],
        notes: '',
      });
      setIsScenicMode(false);
    }
  };

  const getCurrentLocation = field => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
          setFormData(prev => ({ ...prev, [field]: location }));
        },
        () => {
          console.log('Impossibile ottenere la posizione corrente');
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-full sm:w-96 bg-black shadow-2xl overflow-y-auto border-r border-orange-500/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Pianifica Percorso</h2>
              <p className="text-orange-500/80 text-sm mt-1">
                Crea il tuo itinerario personalizzato
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-orange-500 hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Start Point */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-orange-500">
                  <FiNavigation />
                  Punto di Partenza *
                </label>
                <button
                  type="button"
                  onClick={() => getCurrentLocation('startPoint')}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 transition-colors"
                  disabled={isSubmitting}
                >
                  <FiUser size={12} />
                  Usa mia posizione
                </button>
              </div>
              <LocationInput
                value={formData.startPoint}
                onChange={handleInputChange}
                name="startPoint"
                placeholder="Es: Roma, Milano, Firenze..."
                onUseCurrentLocation={() => getCurrentLocation('startPoint')}
              />
            </div>

            {/* Waypoints */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-orange-500">
                  <FiMapPin />
                  Tappe Intermedie
                  <span className="text-xs text-gray-400 font-normal">(opzionali)</span>
                </label>
                <button
                  type="button"
                  onClick={addWaypoint}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <FiPlus size={14} />
                  Aggiungi tappa
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {formData.waypoints.map((waypoint, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={waypoint}
                        onChange={e => handleWaypointChange(index, e.target.value)}
                        placeholder={`Tappa ${index + 1} (es: Ristorante, Museo...)`}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                        disabled={isSubmitting}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        #{index + 1}
                      </div>
                    </div>
                    {formData.waypoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWaypoint(index)}
                        className="px-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* End Point */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-orange-500 mb-2">
                <FiMapPin />
                Punto di Arrivo *
              </label>
              <LocationInput
                value={formData.endPoint}
                onChange={handleInputChange}
                name="endPoint"
                placeholder="Es: Napoli, Torino, Venezia..."
                onUseCurrentLocation={() => getCurrentLocation('endPoint')}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-orange-500 mb-2">
                Note o preferenze
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="2"
                placeholder="Preferenze di percorso, punti di interesse particolari, note..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700 hover:border-orange-500/50 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <FiTarget className={isScenicMode ? 'text-gray-500' : 'text-orange-500'} />
                  <span>Percorso manuale</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleCalculateScenic}
                disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                className={`bg-gradient-to-r ${isScenicMode ? 'from-orange-600/20 to-orange-500/20' : 'from-gray-800 to-gray-900'} text-white py-4 px-4 rounded-xl font-semibold hover:from-orange-600/30 hover:to-orange-500/30 transition-all duration-300 border ${isScenicMode ? 'border-orange-500' : 'border-gray-700'} hover:border-orange-500 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-2">
                  <FiCamera className={isScenicMode ? 'text-orange-400' : 'text-gray-400'} />
                  <span>Percorso Panoramico</span>
                </div>
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </span>
                ) : (
                  <>
                    <FiSave />
                    Salva Percorso
                  </>
                )}
              </button>
            </div>

            {/* Clear Form */}
            <button
              type="button"
              onClick={clearForm}
              disabled={isSubmitting}
              className="w-full py-3 text-gray-400 hover:text-red-500 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancella tutto
            </button>
          </form>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>Crea il tuo percorso con tappe personalizzate.</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>
                  <span className="font-medium text-blue-400">Percorso Panoramico:</span> Il sistema
                  genererà automaticamente un percorso suggestivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerForm;
