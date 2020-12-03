import React from "react";
import { Polyline } from "react-native-maps";

const ShowTrail = () => {
  return (
    <Polyline
      coordinates={[
        { latitude: 44.5229, longitude: -80.34874 },
        { latitude: 44.5227, longitude: -80.34923 },
        { latitude: 44.52262, longitude: -80.34953 },
        { latitude: 44.52241, longitude: -80.35004 },
        { latitude: 44.52221, longitude: -80.35071 },
        { latitude: 44.52203, longitude: -80.35127 },
        { latitude: 44.5218, longitude: -80.35189 },
        { latitude: 44.52195, longitude: -80.35221 },
        { latitude: 44.52252, longitude: -80.3529 },
        { latitude: 44.52242, longitude: -80.35367 },
        { latitude: 44.5225, longitude: -80.35403 },
        { latitude: 44.52267, longitude: -80.35444 },
      ]}
      strokeColor={"blue"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
