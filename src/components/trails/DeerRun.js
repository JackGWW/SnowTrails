import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/DeerRun.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.514505080878735, longitude: -80.36384174600244}}
        trailName={"Deer Run"}
        trailDescription={"422m  -  14m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"651237"}
      />

      <Mapbox.ShapeSource
        id="DeerRun-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="DeerRun-line"
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
