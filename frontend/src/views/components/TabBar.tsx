import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../../views/screens/DashboardScreen";
import ConfiguracoesScreen from "../../views/screens/ConfiguracoesScreen";
import AlertsScreen from "../../views/screens/AlertsScreen";
import { COLORS } from "../../shared/styles/globalStyles";

const Tab = createBottomTabNavigator();

export default function TabBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,

        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "information-circle"
            | "information-circle-outline"
            | "settings"
            | "settings-outline";

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Alerts") {
            iconName = focused ? "information-circle" : "information-circle-outline";
          } else {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />

      <Tab.Screen name="Configuracoes" component={ConfiguracoesScreen} />
    </Tab.Navigator>
  );
}
