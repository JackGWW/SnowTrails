import React from "react";
import { View, Image, StyleSheet, ScrollView  } from "react-native";

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    },
    map: {
        width: 2021,
        height: 3182
    }
  });
  

export default function StaticMap() {
  return (
    <ScrollView style={styles.container}>
      <Image style={styles.map} source={require('../../assets/trailMap.png')} />
    </ScrollView>
  );
}

