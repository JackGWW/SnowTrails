import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LiveMap from "./src/components/LiveMap";
import StaticMap from "./src/components/StaticMap";

const Tab = createBottomTabNavigator();

const slides = [
  {
    key: "Welcome",
    title: "Title 1",
    text: "Description.\nSay something cool",
    image: require("./assets/trailMarkers/circle.png"),
    bg: "#59b2ab",
  },
  {
    key: "Disclaimer",
    title: "Title 2",
    text: "Other cool stuff",
    image: require("./assets/trailMarkers/diamond.png"),
    bg: "#febe29",
  },
  {
    key: "TapTrails",
    title: "Title 2",
    text: "Other cool stuff",
    image: require("./assets/trailMarkers/diamond.png"),
    bg: "#22bcb5",
  },
];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
  },
  image: {
    width: 400,
    height: 400,
    marginVertical: 32,
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
  },
});

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      showRealApp: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("first_time").then((value) => {
      this.setState({ showRealApp: !!value, loading: false });
    });
  }

  _renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.bg,
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    AsyncStorage.setItem("first_time", "true").then(() => {
      this.setState({ showRealApp: true });
    });
  };

  render() {
    if (this.state.showRealApp) {
      return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "GPS") {
                  iconName = focused ? "ios-navigate" : "ios-navigate";
                } else if (route.name === "Map") {
                  iconName = focused ? "ios-map" : "ios-map";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: "#2960AD",
              inactiveTintColor: "gray",
            }}
          >
            <Tab.Screen name="GPS" component={LiveMap} />
            <Tab.Screen name="Map" component={StaticMap} />
          </Tab.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <AppIntroSlider
          showPrevButton={true}
          renderItem={this._renderItem}
          data={slides}
          onDone={this._onDone}
          onSkip={this._onDone}
        />
      );
    }
  }
}
