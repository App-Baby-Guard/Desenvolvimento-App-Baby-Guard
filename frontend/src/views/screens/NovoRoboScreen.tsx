import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import {
  GLOBAL_STYLES,
  COLORS,
  SPACING,
  BORDER_RADIUS,
} from "../../shared/styles/globalStyles";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";

import { useRobos } from "../../context/RoboContext";
import { registrarRobo } from "../../controllers/roboController";
import Toast from "react-native-toast-message";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function NovoRoboScreen() {
  const navigation = useNavigation<Nav>();
  const [nome, setNome] = useState("");
  const [id, setId] = useState("");
  const [local, setLocal] = useState("");
  const { addRobo } = useRobos();

  function handleRegistrar() {
    try {
      registrarRobo(nome, id, local, addRobo);

      Toast.show({
        type: "success",
        text1: "Robô criado! 🎉",
        text2: "Seu robô foi registrado com sucesso.",
        visibilityTime : 3000,
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao criar robô",
        text2: error.message,
        visibilityTime : 3000,
      });
    }
  }

  return (
    <View style={[GLOBAL_STYLES.screen, { padding: SPACING.lg }]}>
      {/* Botão voltar */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: SPACING.lg,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        <Text style={{ marginLeft: 8, color: COLORS.textPrimary }}>Voltar</Text>
      </TouchableOpacity>

      <Text style={GLOBAL_STYLES.title}>Configurar Novo Robô</Text>

      {/* Nome */}
      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        NOME DO ROBÔ
      </Text>
      <TextInput
        placeholder="Ex: Quarto da Sofia"
        placeholderTextColor={COLORS.textTertiary}
        value={nome}
        onChangeText={setNome}
        style={[GLOBAL_STYLES.input, { marginTop: SPACING.xs }]}
      />

      {/* ID */}
      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        ID DO DISPOSITIVO (ESP32)
      </Text>
      <TextInput
        placeholder="Ex: ESP32-BD-001"
        placeholderTextColor={COLORS.textTertiary}
        value={id}
        onChangeText={setId}
        style={[GLOBAL_STYLES.input, { marginTop: SPACING.xs }]}
      />

      {/* Local */}
      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        LOCAL (opcional)
      </Text>
      <TextInput
        placeholder="Ex: Quarto, Sala…"
        placeholderTextColor={COLORS.textTertiary}
        value={local}
        onChangeText={setLocal}
        style={[GLOBAL_STYLES.input, { marginTop: SPACING.xs }]}
      />

      {/* Botão Registrar */}
      <TouchableOpacity
        style={[GLOBAL_STYLES.buttonPrimary, { marginTop: SPACING.xxl }]}
        onPress={handleRegistrar}
      >
        <Text style={GLOBAL_STYLES.buttonPrimaryText}>Registrar Robô</Text>
      </TouchableOpacity>
    </View>
  );
}