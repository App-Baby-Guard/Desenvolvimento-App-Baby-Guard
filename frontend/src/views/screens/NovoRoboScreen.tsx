import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GLOBAL_STYLES,
  COLORS,
  SPACING,
} from "../../shared/styles/globalStyles";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";

import { roboController } from "../../controllers/roboController";
import Toast from "react-native-toast-message";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function NovoRoboScreen() {
  const navigation = useNavigation<Nav>();
  const [nome, setNome] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegistrar() {
    try {
      setLoading(true);
      await roboController.registrarRobo(nome, id);

      Toast.show({
        type: "success",
        text1: "Robô configurado!",
        text2: "Sinal recebido. Dispositivo salvo no banco.",
        visibilityTime: 3000,
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro na conexão",
        text2: error.message,
        visibilityTime: 3000,
      });
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={GLOBAL_STYLES.screen}>
      <View style={{ padding: SPACING.lg }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: SPACING.lg,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          <Text style={{ marginLeft: 8, color: COLORS.textPrimary }}>
            Voltar
          </Text>
        </TouchableOpacity>

        <Text style={GLOBAL_STYLES.title}>Configurar Novo Robô</Text>

        <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
          NOME DO ROBÔ
        </Text>
        <TextInput
          placeholder="Ex: Quarto da Sofia"
          placeholderTextColor={COLORS.textTertiary}
          value={nome}
          onChangeText={setNome}
          style={[GLOBAL_STYLES.input, { marginTop: SPACING.xs }]}
          editable={!loading}
        />

        <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
          ID DO DISPOSITIVO (ESP32 UUID)
        </Text>
        <TextInput
          placeholder="Ex: ESP32-BD-001"
          placeholderTextColor={COLORS.textTertiary}
          value={id}
          onChangeText={setId}
          style={[GLOBAL_STYLES.input, { marginTop: SPACING.xs }]}
          editable={!loading}
        />

        <TouchableOpacity
          style={[
            GLOBAL_STYLES.buttonPrimary,
            { marginTop: SPACING.xxl, opacity: loading ? 0.7 : 1 },
          ]}
          onPress={handleRegistrar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <Text style={GLOBAL_STYLES.buttonPrimaryText}>
              Sincronizar e Registrar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}