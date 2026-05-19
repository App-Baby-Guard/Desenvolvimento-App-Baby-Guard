// src/views/screens/RoboDetalhesScreen.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  GLOBAL_STYLES,
  SPACING,
  COLORS,
} from "../../shared/styles/globalStyles";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";
import { useRobos } from "../../context/RoboContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Params = RouteProp<RootStackParamList, "RoboDetalhes">;

export default function RoboDetalhesScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Params>();

  const { id } = route.params;
  const { getRoboById } = useRobos();

  const robo = getRoboById(id);

  if (!robo) {
    return (
      <View style={[GLOBAL_STYLES.screen, { padding: SPACING.lg }]}>
        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.lg }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          <Text style={{ marginLeft: 8, color: COLORS.textPrimary }}>Voltar</Text>
        </TouchableOpacity>

        <Text style={GLOBAL_STYLES.title}>Robô não encontrado</Text>
        <Text style={GLOBAL_STYLES.textMuted}>
          Parece que este robô foi removido.
        </Text>
      </View>
    );
  }

  return (
    <View style={[GLOBAL_STYLES.screen, { padding: SPACING.lg }]}>
      {/* Botão Voltar */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.lg }}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        <Text style={{ marginLeft: 8, color: COLORS.textPrimary }}>Voltar</Text>
      </TouchableOpacity>

      {/* Nome */}
      <Text style={GLOBAL_STYLES.title}>{robo.nome}</Text>

      {/* ID */}
      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.md }]}>
        ID do dispositivo:
      </Text>
      <Text style={[GLOBAL_STYLES.subtitle, { marginTop: 4 }]}>{robo.id}</Text>

      {/* Local */}
      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        Local:
      </Text>
      <Text style={[GLOBAL_STYLES.text, { marginTop: 4 }]}>
        {robo.local || "Não informado"}
      </Text>

      {/* Status */}
      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        Status:
      </Text>
      <Text style={[GLOBAL_STYLES.text, { marginTop: 4 }]}>
        {robo.status === "config"
          ? "Em configuração"
          : robo.status === "online"
          ? "Online"
          : "Offline"}
      </Text>

      {/* Último sinal */}
      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        Último sinal:
      </Text>
      <Text style={[GLOBAL_STYLES.text, { marginTop: 4 }]}>
        {robo.ultimoSinal || "—"}
      </Text>

      {/* Divisor */}
      <View
        style={{
          height: 1,
          backgroundColor: COLORS.border,
          marginVertical: SPACING.xxl,
        }}
      />

      {/* Botão Renomear */}
      <TouchableOpacity
        style={[GLOBAL_STYLES.buttonPrimary, { marginBottom: SPACING.lg }]}
        onPress={() =>
          navigation.navigate("RenomearRobo", {
            id: robo.id,
            nome: robo.nome,
          })
        }
      >
        <Text style={GLOBAL_STYLES.buttonPrimaryText}>Renomear Robô</Text>
      </TouchableOpacity>

      {/* Botão Ver Dados */}
      <TouchableOpacity
        style={[GLOBAL_STYLES.buttonSecondary]}
        onPress={() => {}}
      >
        <Text style={GLOBAL_STYLES.buttonSecondaryText}>Ver dados</Text>
      </TouchableOpacity>
    </View>
  );
}