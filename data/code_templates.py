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


line_template = Template("""      <TrailLine
        trailPattern={${line_dash_pattern}}
        coordinates={trail}
        color={"${color}"}
      />
""")


trail_template = Template("""import React from "react";
import TrailLine from "./TrailLine";
import trail from "../../../data/json/${filename}.json"

const ShowTrail = (props) => {
  return (
${trail}
  );
};

export default ShowTrail;
""")

trail_and_marker_template = Template("""import React from "react";
import TrailLine from "./TrailLine";
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

