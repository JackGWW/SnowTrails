import React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';

const styles = StyleSheet.create({
  container: {
  },
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  map: {
    width: 799,
    height: 507,
  },
});

export default function StaticMap() {

  return (
    <ImageZoom
      enableCenterFocus={false}
      cropWidth={styles.windowWidth}
      cropHeight={styles.windowHeight}
      imageWidth={styles.map.width}
      imageHeight={styles.map.height}
      minScale={0.5}
      maxScale={8}
      centerOn={{
        x: 45,
        y: 0,
        scale: 1.3,
        duration: 200,
      }}
    >
      <Image
        style={styles.map}
        source={require('../../assets/trailMap.png')}
      />
    </ImageZoom>
  )
}

