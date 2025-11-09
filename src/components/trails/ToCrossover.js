import React from "react";
import TrailLine from "./TrailLine";
import trail from "../../../data/json/ToCrossover.json"

const ShowTrail = (props) => {
  return (
      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#2962FF"}
      />

  );
};

export default ShowTrail;
