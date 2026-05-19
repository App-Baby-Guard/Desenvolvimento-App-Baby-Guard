import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ConfiguracoesScreen from "./src/views/screens/ConfiguracoesScreen";
import PerfilScreen from "./src/views/screens/PerfilScreen";
import DashboardScreen from "./src/views/screens/DashboardScreen";
import TabBar from "./src/views/components/TabBar";
import MeusRobosScreen from "./src/views/screens/MeusRobosScreen";
import RenomearRoboScreen from "./src/views/screens/RenomearRoboScreen";
import AlertsScreen from "./src/views/screens/AlertsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="MeusRobos" component={MeusRobosScreen} />
        <Stack.Screen name="RenomearRobo" component={RenomearRoboScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
