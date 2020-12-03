import React from "react";
import { Polyline } from "react-native-maps";

const ShowTrail = () => {
  return (
    <Polyline
      coordinates={[
        { latitude: 44.52465, longitude: -80.34969 },
        { latitude: 44.52451, longitude: -80.35019 },
        { latitude: 44.52451, longitude: -80.35084 },
        { latitude: 44.52424, longitude: -80.35094 },
        { latitude: 44.52409, longitude: -80.35147 },
        { latitude: 44.52393, longitude: -80.35164 },
        { latitude: 44.52388, longitude: -80.35213 },
        { latitude: 44.52461, longitude: -80.3536 },
        { latitude: 44.52423, longitude: -80.35434 },
        { latitude: 44.52393, longitude: -80.35434 },
        { latitude: 44.52377, longitude: -80.35465 },
        { latitude: 44.52416, longitude: -80.35566 },
        { latitude: 44.52414, longitude: -80.35659 },
        { latitude: 44.52379, longitude: -80.35722 },
        { latitude: 44.52256, longitude: -80.36009 },
        { latitude: 44.52331, longitude: -80.36155 },
        { latitude: 44.52397, longitude: -80.36116 },
        { latitude: 44.52694, longitude: -80.36192 },
        { latitude: 44.52822, longitude: -80.36294 },
        { latitude: 44.52976, longitude: -80.36519 },
        { latitude: 44.53004, longitude: -80.36721 },
      ]}
      strokeColor="red"
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
