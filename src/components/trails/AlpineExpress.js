import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/AlpineExpress.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51894162222743, longitude: -80.34792141057551}}
        trailName={"Alpine Express"}
        trailDescription={"893m  -  147m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"834808"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51680038124323, longitude: -80.35061250440776}}
        trailName={"Alpine Express"}
        trailDescription={"893m  -  147m\u2191 1m\u2193"}
        icon={props.markerImages["Square"]}
        id={"164535"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "AlpineExpress"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "AlpineExpress"}`}
          style={{
            lineColor: "#388E3C",
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
