import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/R2R.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.519146559759974, longitude: -80.36112525500357}}
        trailName={"R2R"}
        trailDescription={"618m  -  114m\u2191 0m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"952436"}
      />

      <Mapbox.ShapeSource
        id="R2R-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="R2R-line"
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
