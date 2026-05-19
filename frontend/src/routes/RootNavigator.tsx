import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../views/screens/LoginScreen";
import RegisterScreen from "../views/screens/RegisterScreen";
import TabNavigator from "./TabNavigator";
import NovoRoboScreen from "../views/screens/NovoRoboScreen";
import RenomearRoboScreen from "../views/screens/RenomearRoboScreen";
import RoboDetalhesScreen from "../views/screens/RoboDetalhesScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  NovoRobo: undefined;
  RenomearRobo: { id: string; nome: string };
  RoboDetalhes: { id: string; nome: string; local?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        {/* Auth (sem validação real) */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main Stack */}
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="NovoRobo" component={NovoRoboScreen} />
        <Stack.Screen name="RenomearRobo" component={RenomearRoboScreen} />
        <Stack.Screen name="RoboDetalhes" component={RoboDetalhesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}