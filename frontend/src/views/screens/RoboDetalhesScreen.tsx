// src/views/screens/RoboDetalhesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  GLOBAL_STYLES,
  SPACING,
  COLORS,
} from "../../shared/styles/globalStyles";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";
import { roboController } from "../../controllers/roboController";
import { Dispositivo } from "../../models/Dispositivo";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Params = RouteProp<RootStackParamList, "RoboDetalhes">;

export default function RoboDetalhesScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Params>();

  const { id } = route.params;

  const [robo, setRobo] = useState<Dispositivo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  async function carregarDetalhes() {
    try {
      setLoading(true);
      const detalhes = await roboController.buscarRobo(id);
      setRobo(detalhes);
    } catch (error: any) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[GLOBAL_STYLES.screen, { padding: SPACING.lg, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.sm }]}>
          Buscando dados do dispositivo...
        </Text>
      </SafeAreaView>
    );
  }

  if (!robo) {
    return (
      <SafeAreaView style={[GLOBAL_STYLES.screen, { padding: SPACING.lg }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.lg }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          <Text style={{ marginLeft: 8, color: COLORS.textPrimary }}>Voltar</Text>
        </TouchableOpacity>

        <Text style={GLOBAL_STYLES.title}>Robô não encontrado</Text>
        <Text style={GLOBAL_STYLES.textMuted}>
          Parece que este robô foi removido ou está inacessível.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[GLOBAL_STYLES.screen, { padding: SPACING.lg }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.lg }}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        <Text style={{ marginLeft: 8, color: COLORS.textPrimary }}>Voltar</Text>
      </TouchableOpacity>

      <Text style={GLOBAL_STYLES.title}>{robo.nome_dispositivo}</Text>

      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.md }]}>
        UUID do dispositivo:
      </Text>
      <Text style={[GLOBAL_STYLES.subtitle, { marginTop: 4 }]}>{robo.uuid_dispositivo}</Text>

      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        Status:
      </Text>
      <Text style={[GLOBAL_STYLES.text, { marginTop: 4 }]}>
        {robo.status_dispositivo === "online" ? "Online" : "Offline"}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: COLORS.border,
          marginVertical: SPACING.xxl,
        }}
      />

      <TouchableOpacity
        style={[GLOBAL_STYLES.buttonPrimary, { marginBottom: SPACING.lg }]}
        onPress={() =>
          navigation.navigate("RenomearRobo", {
            id: robo.uuid_dispositivo,
            nome: robo.nome_dispositivo,
          })
        }
      >
        <Text style={GLOBAL_STYLES.buttonPrimaryText}>Renomear Robô</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[GLOBAL_STYLES.buttonSecondary]}
        onPress={() => {
          // TODO: Navegar para tela de leituras dos sensores
        }}
      >
        <Text style={GLOBAL_STYLES.buttonSecondaryText}>Ver Leituras dos Sensores</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}