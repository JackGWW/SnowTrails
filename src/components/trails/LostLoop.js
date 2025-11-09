import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/LostLoop.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.524339735507965, longitude: -80.36285025067627}}
        trailName={"Lost Loop"}
        trailDescription={"1.49km  -  68m\u2191 24m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"516831"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52674156986177, longitude: -80.36906501278281}}
        trailName={"Lost Loop"}
        trailDescription={"1.49km  -  68m\u2191 24m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"292104"}
      />

      <Mapbox.ShapeSource
        id="LostLoop-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="LostLoop-line"
          style={{
            lineColor: "#D50000",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
