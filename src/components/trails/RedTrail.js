import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/RedTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52644736506045, longitude: -80.38758407346904}}
        trailName={"Red Trail"}
        trailDescription={"1.39km  -  148m\u2191 17m\u2193"}
        icon={props.markerImages["Square"]}
        id={"408594"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52871609479189, longitude: -80.39135039784014}}
        trailName={"Red Trail"}
        trailDescription={"1.39km  -  148m\u2191 17m\u2193"}
        icon={props.markerImages["Square"]}
        id={"304825"}
      />

      <Mapbox.ShapeSource
        id="RedTrail-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="RedTrail-line"
          style={{
            lineColor: "#D50000",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
