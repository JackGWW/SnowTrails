import React from "react";
import { Polyline } from "react-native-maps";

const ShowTrail = () => {
  return (
    <Polyline
      coordinates={[
        { latitude: 44.52299, longitude: -80.35639 },
        { latitude: 44.52368, longitude: -80.35656 },
        { latitude: 44.52421, longitude: -80.35697 },
        { latitude: 44.52479, longitude: -80.35901 },
        { latitude: 44.524, longitude: -80.360239 },
        { latitude: 44.52172, longitude: -80.35946 },
        { latitude: 44.52097, longitude: -80.3588 },
        { latitude: 44.52076, longitude: -80.35721 },
        { latitude: 44.52177, longitude: -80.35783 },
        { latitude: 44.52183, longitude: -80.35736 },
        { latitude: 44.52152, longitude: -80.35577 },
        { latitude: 44.52212, longitude: -80.3557 },
      ]}
      strokeColor={"yellow"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;