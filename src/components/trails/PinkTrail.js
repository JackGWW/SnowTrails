import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/PinkTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5299572031945, longitude: -80.38175747729838}}
        trailName={"Pink Trail"}
        trailDescription={"429m  -  111m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"410388"}
      />

      <Mapbox.ShapeSource
        id="PinkTrail-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="PinkTrail-line"
          style={{
            lineColor: "magenta",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
