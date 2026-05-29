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
import { COLORS } from "../../shared/styles/globalStyles";
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

        <Text style={styles.title}>Configurar Novo Robô</Text>

        <Text style={styles.label}>NOME DO ROBÔ</Text>
        <TextInput
          placeholder="Ex: Quarto da Sofia"
          placeholderTextColor={styles.label.color as string}
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          editable={!loading}
        />

        <Text style={styles.label}>ID DO DISPOSITIVO (ESP32 UUID)</Text>
        <TextInput
          placeholder="Ex: ESP32-BD-001"
          placeholderTextColor={styles.label.color as string}
          value={id}
          onChangeText={setId}
          style={styles.input}
          editable={!loading}
        />

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 28,
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleRegistrar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <Text style={{ color: COLORS.textInverse, fontWeight: "700", fontSize: 14 }}>
              Sincronizar e Registrar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}