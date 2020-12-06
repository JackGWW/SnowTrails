import React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';

const styles = StyleSheet.create({
  container: {
  },
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  map: {
    // width: 3182,
    // height: 2021,
    width: 7991,
    height: 5079,
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
      minScale={0.12}
      maxScale={2}
      // minScale={0.05}
      // maxScale={1}
      centerOn={{
        // x: 200,
        // y: 0,
        // scale: 0.33,
        x: 450,
        y: 0,
        scale: 0.13,
        duration: 200,
      }}
    >
      <Image
        style={styles.map}
        //source={require('../../assets/trailMap.png')}
        source={require('../../assets/trailMapLarge.png')}
      />
    </ImageZoom>
  )
}

