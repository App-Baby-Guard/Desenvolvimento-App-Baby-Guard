import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './src/screens/DashboardScreen';
import AlertsScreen from './src/screens/AlertsScreen';

export type RootTabParamList = {
  Dashboard: undefined;
  Alerts: undefined; //TODO: Adicionar outras telas da aba de navegação
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({ //screenOptions usado para aplicar o visual a todos os ecrãs que pertencem a essa barra de navegação
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline'; //o foco muda o ícone para dar feedback visual
            } else if (route.name === 'Alerts') {
              iconName = focused ? 'notifications' : 'notifications-outline'; //outline é pro icone só com o contorno
            }
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066FF', // Cor azul para a aba ativa. Isso já é da biblioteca do React Navigation
          tabBarInactiveTintColor: '#888888',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
      </Tab.Navigator>
    </NavigationContainer>

  )
}