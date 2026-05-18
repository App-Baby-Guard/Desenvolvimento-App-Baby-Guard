import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "./views/screens/DashboardScreen";
import AlertsScreen from "./views/screens/AlertsScreen";
import MeusRobosScreen from "./views/screens/MeusRobosScreen";

export type RootTabParamList = {
  Dashboard: undefined;
  Alerts: undefined;
  Robos: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#0066FF",
          tabBarInactiveTintColor: "#888",
          tabBarIcon: ({ color, size }) => {
            let icon = "ellipse";

            if (route.name === "Dashboard") icon = "home-outline";
            if (route.name === "Alerts") icon = "notifications-outline";
            if (route.name === "Robos") icon = "hardware-chip-outline";

            return <Ionicons name={icon as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "Início" }}
        />

        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{ title: "Alertas" }}
        />

        <Tab.Screen
          name="Robos"
          component={MeusRobosScreen}
          options={{ title: "Robôs" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}