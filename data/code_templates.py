from string import Template

linked_marker_template = Template("""      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: ${latitude}, longitude: ${longitude}}}
        trailName={"${name}"}
        shape={"${shape}"}
        ref={childRef}
      />
""")

simple_marker_template = Template("""      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: ${latitude}, longitude: ${longitude}}}
        trailName={"${name}"}
        shape={"${shape}"}
      />
""")


linked_line_template = Template("""      <Polyline
        coordinates={trail}
        strokeColor={"${color}"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
""")

simple_line_template = Template("""    <Polyline
      coordinates={trail}
      strokeColor={"${color}"}
      strokeWidth={3}
    />"""
)

trail_template = Template("""import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/${filename}.json"

const ShowTrail = (props) => {
  return (
${trail}
  );
};

export default ShowTrail;
""")

trail_and_marker_template = Template("""import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/${filename}.json"

const ShowTrail = (props) => {
  const childRef = useRef();

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

all_trails_component_template = Template("""      <${filename} longitudeDelta={props.longitudeDelta}/>
""")


