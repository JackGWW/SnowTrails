/**
 * GPX Generator Service
 * Converts trail recording coordinates to GPX format
 */

/**
 * Generates a GPX file content from coordinates array
 * @param {Array} coordinates - Array of coordinate objects with lat, lon, ele, timestamp, etc.
 * @param {Object} metadata - Optional metadata (name, description, type)
 * @returns {string} GPX XML string
 */
export const generateGPX = (coordinates, metadata = {}) => {
  if (!coordinates || coordinates.length === 0) {
    throw new Error('No coordinates provided for GPX generation');
  }

  const {
    name = `Recording ${new Date().toISOString()}`,
    description = 'SnowTrails Recording',
    type = 'skiing',
  } = metadata;

  // Calculate bounds
  const latitudes = coordinates.map((c) => c.latitude);
  const longitudes = coordinates.map((c) => c.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  // Get first timestamp for metadata time
  const firstTimestamp = coordinates[0].timestamp;
  const metadataTime = new Date(firstTimestamp).toISOString();

  // Build track points
  const trackPoints = coordinates
    .map((coord) => {
      const lat = coord.latitude.toFixed(7);
      const lon = coord.longitude.toFixed(7);
      const ele = coord.altitude ? coord.altitude.toFixed(2) : '0.00';
      const time = new Date(coord.timestamp).toISOString();

      return `      <trkpt lat="${lat}" lon="${lon}"><ele>${ele}</ele><time>${time}</time></trkpt>`;
    })
    .join('\n');

  // Build GPX XML
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="SnowTrails" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <time>${metadataTime}</time>
    <bounds maxlat="${maxLat.toFixed(7)}" maxlon="${maxLon.toFixed(7)}" minlat="${minLat.toFixed(7)}" minlon="${minLon.toFixed(7)}"/>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <desc>${escapeXml(description)}</desc>
    <type>${escapeXml(type)}</type>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`;

  return gpx;
};

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
const escapeXml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Generates a filename for the GPX file
 * @param {number} timestamp - Optional timestamp (defaults to now)
 * @returns {string} Filename in format YYYY_MM_DD_HH_mm_ss.gpx
 */
export const generateGPXFilename = (timestamp = Date.now()) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}.gpx`;
};
