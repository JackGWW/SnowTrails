import React from "react";
import TrailLine from "./TrailLine";
import trail from "../../../data/json/TheEastRut.json"

const ShowTrail = (props) => {
  return (
      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#989898"}
      />

  );
};

export default ShowTrail;
