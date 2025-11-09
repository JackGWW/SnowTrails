import React from "react";
import TrailLine from "./TrailLine";
import trail from "../../../data/json/CrossCountryLoop.json"

const ShowTrail = (props) => {
  return (
    <TrailLine
      trailPattern={[3, 3]}
      coordinates={trail}
      color={"#696969"}
    />
  );
};

export default ShowTrail;
