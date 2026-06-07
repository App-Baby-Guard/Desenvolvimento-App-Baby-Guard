// src/views/screens/RoboDetalhesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";
import { roboController } from "../../controllers/roboController";
import { Dispositivo } from "../../models/Dispositivo";
import { COLORS, SPACING } from "../../shared/styles/globalStyles";
import { useTheme } from "../../context/ThemeContext";
import { getStyles } from "../../styles/roboDetalhesStyles";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Params = RouteProp<RootStackParamList, "RoboDetalhes">;

export default function RoboDetalhesScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Params>();
  const { id } = route.params;

  const [robo, setRobo] = useState<Dispositivo | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

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

  async function deletarRobo() {
    try {
      setLoading(true);
      await roboController.removerRobo(id);
      // Volta para a tela anterior (MeusRobosScreen) após deletar
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao excluir robô:", error);
      Alert.alert("Erro", error.message || "Não foi possível excluir o robô.");
      setLoading(false);
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === 'web') {
      if (window.confirm("Tem certeza que deseja excluir este robô permanentemente? Todo o histórico de eventos e sensores associados serão perdidos.")) {
        deletarRobo();
      }
    } else {
      Alert.alert(
        "Excluir Robô",
        "Tem certeza que deseja excluir este robô permanentemente? Todo o histórico de eventos e sensores associados serão perdidos.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: deletarRobo }
        ]
      );
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Buscando dados do dispositivo...</Text>
      </SafeAreaView>
    );
  }

  if (!robo) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backRow}
          >
            <Ionicons name="arrow-back" size={24} color={styles.backText.color as string} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Robô não encontrado</Text>
          <Text style={styles.uuidText}>
            Parece que este robô foi removido ou está inacessível.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backRow}
        >
          <Ionicons name="arrow-back" size={24} color={styles.backText.color as string} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{robo.nome_dispositivo}</Text>

        <Text style={styles.statusLabel}>UUID do dispositivo:</Text>
        <Text style={styles.subtitle}>{robo.uuid_dispositivo}</Text>

        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusText}>
          {robo.status_dispositivo === "online" ? "Online" : "Offline"}
        </Text>

        <View style={styles.divider} />

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.xl,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: SPACING.lg,
          }}
          onPress={() =>
            navigation.navigate("RenomearRobo", {
              id: robo.uuid_dispositivo,
              nome: robo.nome_dispositivo,
            })
          }
        >
          <Text style={{ color: COLORS.textInverse, fontWeight: "700", fontSize: 14 }}>
            Renomear Robô
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => {
            // Navega para a aba Início (Dashboard) para ver os sensores em tempo real
            navigation.navigate("Tabs" as any, { screen: "Início" });
          }}
        >
          <Text style={styles.buttonSecondaryText}>Ver Leituras dos Sensores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonSecondary, { borderColor: COLORS.error, marginTop: 24 }]}
          onPress={confirmarExclusao}
        >
          <Text style={[styles.buttonSecondaryText, { color: COLORS.error }]}>Excluir Robô</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}