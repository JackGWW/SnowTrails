import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Connector.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52190512791276, longitude: -80.36701857112348}}
        trailName={"Connector"}
        trailDescription={"241m  -  45m\u2191 0m\u2193"}
        icon={props.markerImages["Square"]}
        id={"321072"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "Connector"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "Connector"}`}
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
