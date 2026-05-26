import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  GLOBAL_STYLES,
  SPACING,
  COLORS,
  BORDER_RADIUS,
} from "../../shared/styles/globalStyles";

import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";
import { roboController } from "../../controllers/roboController";
import Toast from "react-native-toast-message";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Params = RouteProp<RootStackParamList, "RenomearRobo">;

export default function RenomearRoboScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Params>();

  const { id, nome } = route.params;
  const [novoNome, setNovoNome] = useState(nome);
  const [loading, setLoading] = useState(false);

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
    <View style={[GLOBAL_STYLES.screen, { padding: SPACING.lg }]}>
      <Text style={GLOBAL_STYLES.title}>Renomear Robô</Text>

      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.lg }]}>
        NOME DO DISPOSITIVO
      </Text>

      <TextInput
        value={novoNome}
        onChangeText={setNovoNome}
        style={[
          GLOBAL_STYLES.input,
          { marginTop: SPACING.sm, borderRadius: BORDER_RADIUS.lg },
        ]}
        editable={!loading}
      />

      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.sm }]}>
        UUID: {id}
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginTop: SPACING.xxl,
          gap: SPACING.lg,
        }}
      >
        <TouchableOpacity
          style={[GLOBAL_STYLES.buttonSecondary, { flex: 1 }]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={GLOBAL_STYLES.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            GLOBAL_STYLES.buttonPrimary,
            { flex: 1, opacity: loading ? 0.7 : 1 },
          ]}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <Text style={GLOBAL_STYLES.buttonPrimaryText}>Salvar e Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}