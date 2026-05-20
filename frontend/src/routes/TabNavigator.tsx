import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MeusRobosScreen from "../views/screens/MeusRobosScreen";
import DashboardScreen from "../views/screens/DashboardScreen";
import AlertasScreen from "../views/screens/AlertasScreen";
import ConfiguracoesScreen from "../views/screens/ConfiguracoesScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0066FF",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ color, size }) => {
          let icon = "ellipse";

          if (route.name === "Início") icon = "home-outline";
          if (route.name === "Alertas") icon = "notifications-outline";
          if (route.name === "Robôs") icon = "hardware-chip-outline";
          if (route.name === "Ajustes") icon = "settings-outline";

          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Robôs" component={MeusRobosScreen} />
      <Tab.Screen name="Ajustes" component={ConfiguracoesScreen} />
    </Tab.Navigator>
  );
}