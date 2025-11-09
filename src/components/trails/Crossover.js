import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Crossover.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52254072763026, longitude: -80.36524596624076}}
        trailName={"Crossover"}
        trailDescription={"1.11km  -  80m\u2191 31m\u2193"}
        icon={props.markerImages["Square"]}
        id={"610506"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52450175769627, longitude: -80.36655555479228}}
        trailName={"Crossover"}
        trailDescription={"1.11km  -  80m\u2191 31m\u2193"}
        icon={props.markerImages["Square"]}
        id={"096014"}
      />

      <Mapbox.ShapeSource
        id="Crossover-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="Crossover-line"
          style={{
            lineColor: "#2962FF",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
