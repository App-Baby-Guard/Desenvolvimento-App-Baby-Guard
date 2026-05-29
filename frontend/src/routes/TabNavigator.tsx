import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

import MeusRobosScreen from "../views/screens/MeusRobosScreen";
import DashboardScreen from "../views/screens/DashboardScreen";
import AlertasScreen from "../views/screens/AlertasScreen";
import ConfiguracoesScreen from "../views/screens/ConfiguracoesScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { isDarkMode } = useTheme();

  const tabBarBg = isDarkMode ? '#1a1a2e' : '#FFFFFF';
  const activeColor = isDarkMode ? '#7EC8F8' : '#0066FF';
  const inactiveColor = isDarkMode ? '#6b7280' : '#888';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: isDarkMode ? '#2d2d44' : '#e5e5e5',
        },
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