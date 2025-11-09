import React from "react";
import TrailLine from "./TrailLine";
import trail from "../../../data/json/TheSpur.json"

const ShowTrail = (props) => {
  return (
      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#FF9100"}
      />

  );
};

export default ShowTrail;
