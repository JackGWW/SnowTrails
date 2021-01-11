import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LiveMap from "./src/components/LiveMap";
import StaticMap from "./src/components/StaticMap";

const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "GPS") {
                iconName = focused
                  ? "ios-navigate"
                  : "ios-navigate";
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
  }
}
