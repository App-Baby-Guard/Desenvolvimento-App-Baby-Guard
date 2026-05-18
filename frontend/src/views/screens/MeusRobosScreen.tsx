import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

import {
  GLOBAL_STYLES,
  COLORS,
  SPACING,
  BORDER_RADIUS,
} from "../../shared/styles/globalStyles";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type StatusType = "online" | "offline" | "config";

const mockRobos = [
  {
    id: "ESP32-BD-001",
    nome: "Quarto Sofia",
    status: "online" as StatusType,
    ultimoSinal: "há 1 min",
  },
  {
    id: "ESP32-BD-002",
    nome: "Sala",
    status: "offline" as StatusType,
    ultimoSinal: "há 2h",
  },
  {
    id: "new",
    nome: "Novo robô",
    status: "config" as StatusType,
    ultimoSinal: "Aguardando configuração",
  },
];

export default function MeusRobosScreen() {
  const navigation = useNavigation<Nav>();
  const [busca, setBusca] = useState("");

  function renderStatus(status: StatusType) {
    const map = {
      online: { label: "Online", color: COLORS.success },
      offline: { label: "Offline", color: COLORS.textTertiary },
      config: { label: "Config.", color: COLORS.warning },
    };

    return (
      <View
        style={{
          backgroundColor: map[status].color,
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.xs,
          borderRadius: BORDER_RADIUS.full,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: COLORS.textInverse, fontSize: 12 }}>
          {map[status].label}
        </Text>
      </View>
    );
  }

  function renderItem({ item }: any) {
    const isNew = item.status === "config";

    return (
      <View style={[GLOBAL_STYLES.card, { marginBottom: SPACING.lg }]}>
        <Text style={GLOBAL_STYLES.subtitle}>{item.nome}</Text>
        <Text style={GLOBAL_STYLES.textMuted}>{item.id}</Text>

        <View style={{ marginVertical: SPACING.sm }}>
          {renderStatus(item.status)}
        </View>

        <Text style={GLOBAL_STYLES.textMuted}>{item.ultimoSinal}</Text>

        {isNew ? (
          <TouchableOpacity
            style={[GLOBAL_STYLES.buttonPrimary, { marginTop: SPACING.lg }]}
          >
            <Text style={GLOBAL_STYLES.buttonPrimaryText}>
              Configurar agora
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flexDirection: "row",
              marginTop: SPACING.lg,
              gap: SPACING.lg,
            }}
          >
            <TouchableOpacity
              style={[GLOBAL_STYLES.buttonSecondary, { flex: 1 }]}
              onPress={() =>
                navigation.navigate("RenomearRobo", {
                  id: item.id,
                  nome: item.nome,
                })
              }
            >
              <Text style={GLOBAL_STYLES.buttonSecondaryText}>Renomear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[GLOBAL_STYLES.buttonPrimary, { flex: 1 }]}>
              <Text style={GLOBAL_STYLES.buttonPrimaryText}>Ver dados</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={GLOBAL_STYLES.screen}>
      <View style={{ padding: SPACING.lg }}>
        <Text style={GLOBAL_STYLES.title}>Meus Robôs</Text>

        <TextInput
          placeholder="Buscar robô..."
          placeholderTextColor={COLORS.textTertiary}
          style={[
            GLOBAL_STYLES.input,
            { marginTop: SPACING.lg, borderRadius: BORDER_RADIUS.lg },
          ]}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={mockRobos.filter((r) =>
          r.nome.toLowerCase().includes(busca.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
      />
    </View>
  );
}