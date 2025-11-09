import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/FeelingLazy.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.523445973172784, longitude: -80.35922013223171}}
        trailName={"Feeling Lazy"}
        trailDescription={"170m  -  29m\u2191 2m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"905893"}
      />

      <Mapbox.ShapeSource
        id="FeelingLazy-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="FeelingLazy-line"
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
