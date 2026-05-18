import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import RenomearRoboScreen from "../views/screens/RenomearRoboScreen";

export type RootStackParamList = {
  Tabs: undefined;
  RenomearRobo: { id: string; nome: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="RenomearRobo" component={RenomearRoboScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}