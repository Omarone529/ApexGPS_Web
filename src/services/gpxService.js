import polyline from '@mapbox/polyline';

class GPXService {
    /**
     * Generate GPX XML string from route data
     * @param {Object} route - { id, name, polyline }
     * @returns {string} GPX content
     */
    generateGPX(route) {
        // Decode polyline to array of [lat, lng] pairs
        const coordinates = polyline.decode(route.polyline);

        const pointsXml = coordinates
            .map(([lat, lon]) => `      <trkpt lat="${lat}" lon="${lon}"></trkpt>`)
            .join('\n');

        // Escape the route name to avoid XML issues
        const safeName = this.escapeXml(route.name);

        return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="YourApp">
  <trk>
    <name>${safeName}</name>
    <trkseg>
${pointsXml}
    </trkseg>
  </trk>
</gpx>`;
    }

    /**
     * Trigger a browser download of the GPX file
     * @param {Object} route - { id, name, polyline }
     * @param {string} [filename] - optional custom filename
     */
    downloadGPX(route, filename) {
        const gpxContent = this.generateGPX(route);
        const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `route_${route.id}.gpx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    /**
     * Simple XML escaping to prevent injection
     * @param {string} unsafe
     * @returns {string}
     */
    escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, c => {
            switch (c) {
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '&':
                    return '&amp;';
                case "'":
                    return '&apos;';
                case '"':
                    return '&quot;';
                default:
                    return c;
            }
        });
    }
}

export const gpxService = new GPXService();
