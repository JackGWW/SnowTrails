import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/TopTraverse.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.509754721075296, longitude: -80.34231634810567}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"703037"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50807213783264, longitude: -80.33747387118638}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"353734"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.511623214930296, longitude: -80.34623807296157}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"803127"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51373335905373, longitude: -80.35055374726653}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"882128"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "TopTraverse"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "TopTraverse"}`}
          style={{
            lineColor: "#212121",
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
