import React from "react";
import Mapbox from "@rnmapbox/maps";

const trails = require("../../data/trails.geojson");

const AllTrails = () => {
  return (
    <Mapbox.ShapeSource id="all-trails" shape={trails}>
      <Mapbox.LineLayer
        id="trail-lines"
        style={{
          lineColor: ['get', 'color'],
          lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
          lineCap: 'round',
          lineJoin: 'round',
          lineDasharray: [
            'case',
            ['!=', ['get', 'lineDasharray'], null],
            ['get', 'lineDasharray'],
            ['literal', [1, 0]] // solid line (no dash)
          ],
        }}
      />
    </Mapbox.ShapeSource>
  );
};

export default AllTrails;
