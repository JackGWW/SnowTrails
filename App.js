import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "sentry-expo";

import LiveMap from "./src/components/LiveMap";
import StaticMap from "./src/components/StaticMap";

Sentry.init({
  dsn:
    "https://b8aeee3910554706876c9c506e83b871@o513818.ingest.sentry.io/5616317",
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

const Tab = createBottomTabNavigator();

const slides = [
  {
    key: "Welcome",
    title: "Welcome!",
    text:
      "Enjoy using SnowTrails, your snowshoe trail map for Alpine & Craigleith.",
    image: require("./assets/doubleSnowshoe.png"),
    bg: "#1679F3",
  },
  {
    key: "Disclaimer",
    title: "Disclaimer",
    text:
      "Many of the trails shown are on private property.  Trails on the property of Alpine and Craigleith Ski Clubs may only be used by members of those clubs.\n\nAlpine and Craigleith Ski Clubs do not maintain the trails and assume no liability to users of the trails or this app, whether for trail condition, trail markings, map accuracy, app function or any other matter whatsoever.  Users of the trails and this app do so at their own risk.",
    image: require("./assets/disclaimer.png"),
    bg: "#DF9313",
  },
  {
    key: "Tap",
    title: "Tip: Tap on Trails",
    text: "Tap on trails or difficulty markers to see the trail name.",
    image: require("./assets/touchTrail.png"),
    bg: "#B030DE",
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
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.4,
    marginVertical: 24,
    resizeMode: "contain",
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 26,
    color: "white",
    textAlign: "center",
  },
});

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      showRealApp: false,
      nextLabel: "Next",
      showNextButton: true,
      showPrevButton: true,
      disclaimerShown: false,
    };
  }

  componentDidMount() {
    if (!__DEV__) {
      AsyncStorage.getItem("first_time").then((value) => {
        this.setState({ showRealApp: !!value, loading: false });
      });
    }
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

  updateCurrentSlide = (index, lastIndex) => {
    // If it's on the disclaimer slide, change the next button to "I Agree"
    if (index === 1) {
      this.setState({ nextLabel: "I Agree" });
      
      // Hide the next button for 3 seconds the first time the disclaimer is shown
      if (!this.state.disclaimerShown) {
        this.setState({ showNextButton: false, showPrevButton: false });
        setTimeout(() => {
          this.setState({ showNextButton: true, showPrevButton: true });
        }, 3000);
        this.setState({ disclaimerShown: true });
      }
    } else {
      this.setState({ nextLabel: "Next" });
      this.setState({ showNextButton: true, showPrevButton: true });
    }
  };

  _onDone = () => {
    // User finished the introduction. Show real app
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
              activeTintColor: "#1679F3",
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
          onSlideChange={this.updateCurrentSlide}
          data={slides}
          onDone={this._onDone}
          onSkip={this._onDone}
          nextLabel={this.state.nextLabel}
          showNextButton={this.state.showNextButton}
          showPrevButton={this.state.showPrevButton}
        />
      );
    }
  }
}
