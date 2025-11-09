import React from "react";
import TrailLine from "./TrailLine";
import trail from "../../../data/json/BruceTrailConnection.json"

const ShowTrail = (props) => {
  return (
      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#212121"}
      />

  );
};

export default ShowTrail;
