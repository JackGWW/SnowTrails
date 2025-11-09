import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/RiverRoute.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51853836886585, longitude: -80.3588873706758}}
        trailName={"River Route"}
        trailDescription={"1.11km  -  102m\u2191 6m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"809955"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51615002937615, longitude: -80.36024440079927}}
        trailName={"River Route"}
        trailDescription={"1.11km  -  102m\u2191 6m\u2193"}
        icon={props.markerImages["Square"]}
        id={"423125"}
      />

      <Mapbox.ShapeSource
        id="RiverRoute-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="RiverRoute-line"
          style={{
            lineColor: "#FFEA00",
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
