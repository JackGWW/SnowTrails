import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/EnchantedForest.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51386227272451, longitude: -80.35742313601077}}
        trailName={"Enchanted Forest"}
        trailDescription={"707m  -  22m\u2191 24m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"328626"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "EnchantedForest"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "EnchantedForest"}`}
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
