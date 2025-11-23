import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import * as Amplitude from '@amplitude/analytics-react-native';

import LiveMap from "./src/components/LiveMap";
import RecordingScreen from "./src/components/RecordingScreen";
import StaticMap from "./src/components/StaticMap";

// Setup crash reports
Sentry.init({
  dsn:
    "https://b8aeee3910554706876c9c506e83b871@o513818.ingest.sentry.io/5616317",
  enableInExpoDevelopment: true,
  debug: false,
});

// Log app startup
Amplitude.init("1d4737f626618248997180e48f0bfd02", undefined, {
  disableCookies: true, // Disable cookies for React Native
});
Amplitude.track('App Started')

const Tab = createBottomTabNavigator();

// Wrapper component to provide safe area insets to tab navigator
function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "GPS") {
            iconName = focused ? "navigate" : "navigate-outline";
          } else if (route.name === "Record") {
            iconName = focused ? "radio-button-on" : "radio-button-off";
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2E3A52",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          height: 60 + insets.bottom,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="GPS"
        component={LiveMap}
        options={{ tabBarLabel: "Live Map" }}
      />
      <Tab.Screen
        name="Record"
        component={RecordingScreen}
        options={{ tabBarLabel: "Record" }}
      />
      <Tab.Screen
        name="Map"
        component={StaticMap}
        options={{ tabBarLabel: "Trail Map" }}
      />
    </Tab.Navigator>
  );
}

const slides = [
  {
    key: "Welcome",
    title: "Welcome to SnowTrails",
    text:
      "Your digital map for exploring snowshoe trails at Alpine, Craigleith & Georgian Peaks Ski Clubs.",
    image: require("./assets/doubleSnowshoe.png"),
    bg: "#1679F3",
    bgGradient: ["#1679F3", "#0D5ACC"],
  },
  {
    key: "Disclaimer",
    title: "",
    text:
    "Many trails shown are on private property. Trails on ski club property may only be used by club members.\n\nAlpine, Craigleith & Georgian Peaks Ski Clubs do not maintain the trails and assume no liability to users of the trails or this app, whether for trail condition, trail markings, map accuracy or any other matter whatsoever. Users of the trails and this app do so at their own risk.",
    image: require("./assets/disclaimer.png"),
    bg: "#E8734E",
    bgGradient: ["#E8734E", "#D65A3D"],
  },
  {
    key: "Tap",
    title: "",
    text: "Tap on any trail to view detailed information and plan your adventure.",
    image: require("./assets/touchTrail.png"),
    bg: "#B030DE",
    bgGradient: ["#B030DE", "#8B24B0"],
  },
];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  slideGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  image: {
    width: Dimensions.get("window").width * 0.65,
    height: Dimensions.get("window").height * 0.32,
    marginBottom: 32,
    marginTop: 20,
    resizeMode: "contain",
  },
  text: {
    color: "rgba(255, 255, 255, 0.92)",
    textAlign: "center",
    fontSize: 17,
    lineHeight: 26,
    marginHorizontal: 20,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
});

class App extends React.Component {
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
      <View style={styles.slide}>
        <LinearGradient
          colors={item.bgGradient || [item.bg, item.bg]}
          style={styles.slideGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
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
        <SafeAreaProvider>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      );
    } else {
      return (
        <AppIntroSlider
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

export default Sentry.wrap(App);
