import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../../shared/styles/globalStyles";
import { roboController } from "../../controllers/roboController";
import Toast from "react-native-toast-message";
import { useTheme } from "../../context/ThemeContext";
import { getStyles } from "../../styles/novoRoboStyles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function NovoRoboScreen() {
  const navigation = useNavigation<Nav>();
  const [nome, setNome] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  async function handleRegistrar() {
    try {
      setLoading(true);
      await roboController.registrarRobo(nome, id);

      Toast.show({
        type: "success",
        text1: "Robô configurado!",
        text2: "Tudo pronto! Seu robô já está conectado à sua conta.",
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
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backRow}
        >
          <Ionicons name="arrow-back" size={24} color={styles.backText.color as string} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Conectar Novo Robô</Text>

        <Text style={styles.label}>NOME DO ROBÔ</Text>
        <TextInput
          placeholder="Ex: Quarto da Sofia"
          placeholderTextColor={styles.label.color as string}
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          editable={!loading}
        />

        <Text style={styles.label}>CÓDIGO DE PAREAMENTO</Text>
        <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 18 }}>
          Encontre o código único impresso na etiqueta localizada na parte inferior do seu BabyGuard ou na caixa do produto.
        </Text>
        <TextInput
          placeholder="Ex: SIM-ESP32-001"
          placeholderTextColor={styles.label.color as string}
          value={id}
          onChangeText={setId}
          style={styles.input}
          editable={!loading}
        />

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: SPACING.lg,
            paddingHorizontal: SPACING.xl,
            borderRadius: BORDER_RADIUS.md,
            alignItems: "center",
            justifyContent: "center",
            marginTop: SPACING.xxl,
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleRegistrar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <Text style={{ color: COLORS.textInverse, fontWeight: TYPOGRAPHY.weight.bold, fontSize: TYPOGRAPHY.size.md }}>
              Conectar Robô
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}