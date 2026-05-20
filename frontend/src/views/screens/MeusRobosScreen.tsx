import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GLOBAL_STYLES,
  COLORS,
  SPACING,
  BORDER_RADIUS,
} from "../../shared/styles/globalStyles";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";

import { useRobos } from "../../context/RoboContext";
import { Robo } from "../../context/RoboContext";
import Toast from "react-native-toast-message";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MeusRobosScreen() {
  const navigation = useNavigation<Nav>();
  const { robos, removeRobo } = useRobos();
  const [busca, setBusca] = useState("");

  const robosMock: Robo[] = [
    {
      id: "ESP32-BD-001",
      nome: "Quarto Sofia",
      local: "Quarto",
      status: "online",
      ultimoSinal: "há 1 min",
    },
    {
      id: "ESP32-BD-002",
      nome: "Sala",
      local: "Sala",
      status: "offline",
      ultimoSinal: "há 2h",
    },
  ];

  const mockConfig = {
    id: "new",
    nome: "Novo Robô",
    local: "",
    status: "config",
    ultimoSinal: "Aguardando configuração",
  };

  const listaCompleta = [...robosMock, ...robos, mockConfig];

  function renderStatus(status: string) {
    const map: any = {
      online: { label: "Online", color: COLORS.success },
      offline: { label: "Offline", color: COLORS.textTertiary },
      config: { label: "Config.", color: COLORS.warning },
    };
    const estilo = map[status] || map["config"];
    return (
      <View
        style={{
          backgroundColor: estilo.color,
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.xs,
          borderRadius: BORDER_RADIUS.full,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: COLORS.textInverse, fontSize: 12 }}>
          {estilo.label}
        </Text>
      </View>
    );
  }

  function renderItem({ item }: { item: Robo }) {
    const isConfig = item.id === "new";

    return (
      <View style={[GLOBAL_STYLES.card, { marginBottom: SPACING.lg }]}>
        <Text style={GLOBAL_STYLES.subtitle}>{item.nome}</Text>
        <Text style={GLOBAL_STYLES.textMuted}>{item.id}</Text>

        <View style={{ marginVertical: SPACING.sm }}>
          {renderStatus(item.status)}
        </View>

        <Text style={GLOBAL_STYLES.textMuted}>{item.ultimoSinal}</Text>

        {isConfig ? (
          <TouchableOpacity
            style={[GLOBAL_STYLES.buttonPrimary, { marginTop: SPACING.lg }]}
            onPress={() => {
              navigation.getParent()?.navigate("NovoRobo");
            }}
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
            {!item.id.startsWith("ESP32") && (
              <>
                <TouchableOpacity
                  style={[GLOBAL_STYLES.buttonSecondary, { flex: 1 }]}
                  onPress={() => {
                    navigation.getParent()?.navigate("RenomearRobo", {
                      id: item.id,
                      nome: item.nome,
                    });
                  }}
                >
                  <Text style={GLOBAL_STYLES.buttonSecondaryText}>
                    Renomear
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    GLOBAL_STYLES.buttonSecondary,
                    { flex: 1, backgroundColor: "#c0392b" },
                  ]}
                  onPress={() => {
                    removeRobo(item.id);
                    Toast.show({
                      type: "success",
                      text1: "Robô excluído! 🗑️",
                      text2: `${item.nome} foi removido.`,
                      visibilityTime: 3000,
                    });
                  }}
                >
                  <Text
                    style={[
                      GLOBAL_STYLES.buttonPrimaryText,
                      { color: "#fff" },
                    ]}
                  >
                    Excluir
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[GLOBAL_STYLES.buttonPrimary, { flex: 1 }]}
              onPress={() => {
                navigation.getParent()?.navigate("RoboDetalhes", {
                  id: item.id,
                  nome: item.nome,
                  local: item.local,
                });
              }}
            >
              <Text style={GLOBAL_STYLES.buttonPrimaryText}>
                Ver detalhes
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const listaFiltrada = listaCompleta.filter((r) =>
    r.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={GLOBAL_STYLES.screen}>
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
        data={listaFiltrada}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
      />
    </SafeAreaView>
  );
}