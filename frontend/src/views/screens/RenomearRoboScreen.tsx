import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { useRobos } from "../../context/RoboContext";
import Toast from "react-native-toast-message";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Params = RouteProp<RootStackParamList, "RenomearRobo">;

export default function RenomearRoboScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Params>();

  const { id, nome } = route.params;
  const [novoNome, setNovoNome] = useState(nome);
  const { updateRobo } = useRobos();

  function handleSalvar() {
    updateRobo(id, { nome: novoNome });

    Toast.show({
      type: "success",
      text1: "Robô renomeado!",
      text2: `Novo nome: ${novoNome}`,
      visibilityTime : 3000,
    });

    setTimeout(() => {
      navigation.goBack();
    }, 1500);
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
      />

      <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.sm }]}>
        ID: {id}
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
        >
          <Text style={GLOBAL_STYLES.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[GLOBAL_STYLES.buttonPrimary, { flex: 1 }]}
          onPress={handleSalvar}
        >
          <Text style={GLOBAL_STYLES.buttonPrimaryText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}