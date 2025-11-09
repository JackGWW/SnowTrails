import React from "react";
import TrailLine from "./TrailLine";
import trail from "../../../data/json/TheLink.json"

const ShowTrail = (props) => {
  return (
      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#388E3C"}
      />

  );
};

export default ShowTrail;
