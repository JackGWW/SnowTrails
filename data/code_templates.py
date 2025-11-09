from string import Template

marker_template = Template("""      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: ${latitude}, longitude: ${longitude}}}
        trailName={"${name}"}
        ${trailDescription}
        icon={props.markerImages["${shape}"]}
        id={"${id}"}
      />
""")


line_template = Template("""      <Mapbox.ShapeSource
        id="${id}-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="${id}-line"
          style={{
            lineColor: "${color}",
            lineWidth: 3,
            ${lineDashArray}
          }}
        />
      </Mapbox.ShapeSource>
""")


trail_template = Template("""import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/${filename}.json"

const ShowTrail = (props) => {
  return (
${trail}
  );
};

export default ShowTrail;
""")

trail_and_marker_template = Template("""import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/${filename}.json"

const ShowTrail = (props) => {
  return (
    <>
${markers}
${trail}    </>
  );
};

export default ShowTrail;
""")

all_trails_template = Template("""import React from "react";
${imports}

const ShowTrail = (props) => {
  return (
    <>
${components}    </>
  )
}

export default ShowTrail;
""")

all_trails_import_template = Template("""import ${filename} from "./${filename}"
""")

all_trails_component_template = Template("""      <${filename} longitudeDelta={props.longitudeDelta} markerImages={props.markerImages} trailPattern={props.trailPattern}/>
""")
