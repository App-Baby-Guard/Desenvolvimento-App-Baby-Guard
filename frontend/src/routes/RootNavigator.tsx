import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import NovoRoboScreen from "../views/screens/NovoRoboScreen";
import RenomearRoboScreen from "../views/screens/RenomearRoboScreen";
import RoboDetalhesScreen from "../views/screens/RoboDetalhesScreen";

export type RootStackParamList = {
  Tabs: undefined;

  NovoRobo: undefined;

  RenomearRobo: {
    id: string;
    nome: string;
  };

  RoboDetalhes: {
    id: string;
    nome: string;
    local?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />

        <Stack.Screen name="NovoRobo" component={NovoRoboScreen} />
        <Stack.Screen name="RenomearRobo" component={RenomearRoboScreen} />
        <Stack.Screen name="RoboDetalhes" component={RoboDetalhesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}