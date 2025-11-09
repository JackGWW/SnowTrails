import React, { useMemo, useRef } from "react";
import MapboxGL from "@rnmapbox/maps";

const TrailLine = ({ coordinates, color, trailPattern }) => {
  const lineIdRef = useRef(`trail-line-${Math.random().toString(36).slice(2, 10)}`);

  const shape = useMemo(() => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates.map((point) => [point.longitude, point.latitude]),
    },
  }), [coordinates]);

  const lineStyle = useMemo(() => ({
    lineColor: color,
    lineWidth: 3,
    lineCap: "round",
    lineJoin: "round",
    ...(trailPattern ? { lineDasharray: trailPattern } : {}),
  }), [color, trailPattern]);

  return (
    <MapboxGL.ShapeSource id={`${lineIdRef.current}-source`} shape={shape}>
      <MapboxGL.LineLayer id={`${lineIdRef.current}-layer`} style={lineStyle} />
    </MapboxGL.ShapeSource>
  );
};

export default TrailLine;
