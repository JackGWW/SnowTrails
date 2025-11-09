import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Woodpecker.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5235022995621, longitude: -80.36865320988}}
        trailName={"Woodpecker"}
        trailDescription={"274m  -  28m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"103179"}
      />

      <Mapbox.ShapeSource
        id="Woodpecker-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="Woodpecker-line"
          style={{
            lineColor: "#FF9100",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
