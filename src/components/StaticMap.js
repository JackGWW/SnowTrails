import React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';

const styles = StyleSheet.create({
  container: {
  },
  map: {
    width: 3182,
    height: 2021
  }
});

export default function StaticMap() {

  return (
    <ImageZoom cropWidth={Dimensions.get('window').width}
      cropHeight={Dimensions.get('window').height}
      imageWidth={styles.map.width}
      imageHeight={styles.map.height}
      enableCenterFocus={false}
      minScale={0.1}
      maxScale={2}
    >
      <Image style={styles.map}
        source={require('../../assets/trailMap.png')} />
    </ImageZoom>
  )
}

