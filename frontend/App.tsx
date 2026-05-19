import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

<<<<<<< HEAD
import LoginScreen from "./views/screens/LoginScreen";
import RegisterScreen from "./views/screens/RegisterScreen";
import TabNavigator from "./routes/TabNavigator";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
=======
import ConfiguracoesScreen from "./src/views/screens/ConfiguracoesScreen";
import PerfilScreen from "./src/views/screens/PerfilScreen";
import DashboardScreen from "./src/views/screens/DashboardScreen";
import TabBar from "./src/views/components/TabBar";
import MeusRobosScreen from "./src/views/screens/MeusRobosScreen";
import RenomearRoboScreen from "./src/views/screens/RenomearRoboScreen";
import AlertsScreen from "./src/views/screens/AlertsScreen";

const Stack = createNativeStackNavigator();
>>>>>>> 46eb5737ade3bb1205018373a3d0dc81b112ca9c

export default function App() {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
=======
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="MeusRobos" component={MeusRobosScreen} />
        <Stack.Screen name="RenomearRobo" component={RenomearRoboScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
>>>>>>> 46eb5737ade3bb1205018373a3d0dc81b112ca9c
      </Stack.Navigator>
    </NavigationContainer>
  );
}