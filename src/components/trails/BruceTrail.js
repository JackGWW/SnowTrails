import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/BruceTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51797074638307, longitude: -80.36381995305419}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Circle"]}
        id={"667112"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.512506583705544, longitude: -80.35317770205438}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Circle"]}
        id={"834884"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.522331012412906, longitude: -80.37698993459344}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Circle"]}
        id={"218053"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51732969842851, longitude: -80.36766196601093}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Circle"]}
        id={"758242"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51310262084007, longitude: -80.36579062230885}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Diamond"]}
        id={"146878"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51208262704313, longitude: -80.35794675350189}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Square"]}
        id={"458764"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51365230605006, longitude: -80.36034800112247}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Diamond"]}
        id={"507241"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51309658586979, longitude: -80.36267129704356}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Diamond"]}
        id={"117377"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51537939719856, longitude: -80.36508939228952}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Diamond"]}
        id={"509096"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52007527463138, longitude: -80.36667801439762}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Circle"]}
        id={"976624"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5241323672235, longitude: -80.37579266354442}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Circle"]}
        id={"320915"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.518202506005764, longitude: -80.37597899325192}}
        trailName={"Bruce Trail"}
        
        icon={props.markerImages["Circle"]}
        id={"246156"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "BruceTrail"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "BruceTrail"}`}
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
