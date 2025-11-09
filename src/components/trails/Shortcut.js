import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Shortcut.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.522471660748124, longitude: -80.35474914126098}}
        trailName={"Shortcut"}
        trailDescription={"244m  -  42m\u2191 4m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"051286"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "Shortcut"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "Shortcut"}`}
          style={{
            lineColor: "#FFEA00",
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
