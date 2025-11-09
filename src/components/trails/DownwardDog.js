import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/DownwardDog.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51655210927129, longitude: -80.36226284690201}}
        trailName={"Downward Dog"}
        trailDescription={"400m  -  69m\u2191 3m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"630725"}
      />

      <Mapbox.ShapeSource
        id="DownwardDog-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="DownwardDog-line"
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
