import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../views/screens/LoginScreen";
import RegisterScreen from "../views/screens/RegisterScreen";
import TabNavigator from "./TabNavigator";
import NovoRoboScreen from "../views/screens/NovoRoboScreen";
import RenomearRoboScreen from "../views/screens/RenomearRoboScreen";
import RoboDetalhesScreen from "../views/screens/RoboDetalhesScreen";
import PerfilScreen from "../views/screens/PerfilScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  NovoRobo: undefined;
  RenomearRobo: { id: string; nome: string };
  RoboDetalhes: { id: string; nome: string; local?: string };
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { estaLogado, carregandoSessao } = useAuth();

  // enquanto o app verifica se há sessão salva no AsyncStorage, exibe um loading
  if (carregandoSessao) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        // se já está logado, vai direto para Tabs; caso contrário, vai para Login
        initialRouteName={estaLogado ? "Tabs" : "Login"}
      >
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main Stack */}
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="NovoRobo" component={NovoRoboScreen} />
        <Stack.Screen name="RenomearRobo" component={RenomearRoboScreen} />
        <Stack.Screen name="RoboDetalhes" component={RoboDetalhesScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}