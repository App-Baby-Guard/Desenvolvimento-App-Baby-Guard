import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MeusRobosScreen from "../views/screens/MeusRobosScreen";
import DashboardScreen from "../views/screens/DashboardScreen";
import AlertsScreen from "../views/screens/AlertsScreen";

const Tab = createBottomTabNavigator();

function Placeholder({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{title}</Text>
    </View>
  );
}

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
          if (route.name === "Perfil") icon = "person-outline";

          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Alertas" component={AlertsScreen} />
      <Tab.Screen name="Robôs" component={MeusRobosScreen} />
      <Tab.Screen name="Ajustes" children={() => <Placeholder title="Ajustes" />} />
      <Tab.Screen name="Perfil" children={() => <Placeholder title="Perfil" />} />
    </Tab.Navigator>
  );
}