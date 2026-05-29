import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";
import { COLORS } from "../../shared/styles/globalStyles";
import { roboController } from "../../controllers/roboController";
import Toast from "react-native-toast-message";
import { useTheme } from "../../context/ThemeContext";
import { getStyles } from "../../styles/renomearRoboStyles";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Params = RouteProp<RootStackParamList, "RenomearRobo">;

export default function RenomearRoboScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Params>();
  const { id, nome } = route.params;
  const [novoNome, setNovoNome] = useState(nome);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  async function handleSalvar() {
    try {
      setLoading(true);
      await roboController.renomearRobo(id, novoNome);

      Toast.show({
        type: "success",
        text1: "Sincronizado!",
        text2: `O nome foi alterado no dispositivo para: ${novoNome}`,
        visibilityTime: 3000,
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro de comunicação",
        text2: error.message,
      });
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Renomear Robô</Text>

        <Text style={styles.label}>NOME DO DISPOSITIVO</Text>
        <TextInput
          value={novoNome}
          onChangeText={setNovoNome}
          style={styles.input}
          editable={!loading}
        />

        <Text style={styles.uuid}>UUID: {id}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLORS.primary,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
            }}
            onPress={handleSalvar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textInverse} />
            ) : (
              <Text style={{ color: COLORS.textInverse, fontWeight: "700", fontSize: 14 }}>
                Salvar e Enviar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}