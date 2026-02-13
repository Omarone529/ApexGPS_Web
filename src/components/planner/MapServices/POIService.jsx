const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const poiService = {
  async getAllPOIs() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gis/points-of-interest/`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento dei POI');
      }

      const pois = await response.json();
      return pois;
    } catch (error) {
      console.error('Errore nel caricamento POI:', error);
      return [];
    }
  },

  formatPOIsForMap(pois) {
    return pois.map(poi => ({
      id: poi.id,
      name: poi.name,
      category: poi.category,
      coordinates: [poi.latitude, poi.longitude],
      description: poi.description,
      scenic_value: poi.importance_score || 1.0,
    }));
  },
};
