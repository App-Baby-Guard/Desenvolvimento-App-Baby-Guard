import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GLOBAL_STYLES,
  COLORS,
  SPACING,
  BORDER_RADIUS,
} from "../../shared/styles/globalStyles";

import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";

import { roboController } from "../../controllers/roboController";
import { Dispositivo } from "../../models/Dispositivo";
import Toast from "react-native-toast-message";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MeusRobosScreen() {
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const [busca, setBusca] = useState("");
  const [robos, setRobos] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);

  // Recarrega a lista sempre que a tela ganha foco (ex: ao voltar de NovoRobo)
  useEffect(() => {
    if (isFocused) {
      carregarRobos();
    }
  }, [isFocused]);

  async function carregarRobos() {
    try {
      setLoading(true);
      const dados = await roboController.listarRobos();
      setRobos(dados);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRemover(uuid: string, nome: string) {
    try {
      await roboController.removerRobo(uuid);
      Toast.show({
        type: "success",
        text1: "Robô excluído!",
        text2: `${nome} foi removido.`,
        visibilityTime: 3000,
      });
      // Recarrega a lista após exclusão
      carregarRobos();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir",
        text2: error.message,
      });
    }
  }

  function renderStatus(status: string) {
    const map: any = {
      online: { label: "Online", color: COLORS.success },
      offline: { label: "Offline", color: COLORS.textTertiary },
    };
    const estilo = map[status] || { label: "Config.", color: COLORS.warning };
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

  function renderItem({ item }: { item: Dispositivo }) {
    return (
      <View style={[GLOBAL_STYLES.card, { marginBottom: SPACING.lg }]}>
        <Text style={GLOBAL_STYLES.subtitle}>{item.nome_dispositivo}</Text>
        <Text style={GLOBAL_STYLES.textMuted}>{item.uuid_dispositivo}</Text>

        <View style={{ marginVertical: SPACING.sm }}>
          {renderStatus(item.status_dispositivo)}
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: SPACING.lg,
            gap: SPACING.lg,
          }}
        >
          <TouchableOpacity
            style={[GLOBAL_STYLES.buttonSecondary, { flex: 1 }]}
            onPress={() => {
              navigation.getParent()?.navigate("RenomearRobo", {
                id: item.uuid_dispositivo,
                nome: item.nome_dispositivo,
              });
            }}
          >
            <Text style={GLOBAL_STYLES.buttonSecondaryText}>Renomear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GLOBAL_STYLES.buttonSecondary,
              { flex: 1, backgroundColor: "#c0392b" },
            ]}
            onPress={() => handleRemover(item.uuid_dispositivo, item.nome_dispositivo)}
          >
            <Text style={[GLOBAL_STYLES.buttonPrimaryText, { color: "#fff" }]}>
              Excluir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[GLOBAL_STYLES.buttonPrimary, { flex: 1 }]}
            onPress={() => {
              navigation.getParent()?.navigate("RoboDetalhes", {
                id: item.uuid_dispositivo,
                nome: item.nome_dispositivo,
                local: undefined,
              });
            }}
          >
            <Text style={GLOBAL_STYLES.buttonPrimaryText}>Detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Card fixo para adicionar novo robô
  function renderAddCard() {
    return (
      <View style={[GLOBAL_STYLES.card, { marginBottom: SPACING.lg }]}>
        <Text style={GLOBAL_STYLES.subtitle}>Novo Robô</Text>
        <Text style={GLOBAL_STYLES.textMuted}>Aguardando configuração</Text>
        <TouchableOpacity
          style={[GLOBAL_STYLES.buttonPrimary, { marginTop: SPACING.lg }]}
          onPress={() => {
            navigation.getParent()?.navigate("NovoRobo");
          }}
        >
          <Text style={GLOBAL_STYLES.buttonPrimaryText}>Configurar agora</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const listaFiltrada = robos.filter((r) =>
    r.nome_dispositivo.toLowerCase().includes(busca.toLowerCase())
  );
 
  //========= TESTE RÁPIDO DO CRUD NO BANCO LOCAL (SQLite) =========
  async function testarCRUD() {
    try {
      // 1. Cria um dispositivo de teste
      await dispositivoService.criarDispositivo({
        uuid_dispositivo: 'teste-uuid-' + Date.now(),
        nome_dispositivo: 'Robô Teste ' + new Date().getSeconds(),
        status_dispositivo: 'online',
        ativo: 1,
      });

      // 2. Lista os dispositivos
      const dispositivos = await dispositivoService.listarDispositivos();
      
      Toast.show({
        type: "success",
        text1: "Teste SQLite concluído! ✅",
        text2: `Agora existem ${dispositivos.length} robôs no banco local.`,
        visibilityTime: 4000,
      });

      // Recarrega os robôs no contexto se necessário (aqui só mostramos o toast para confirmar que salvou)
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro no teste do SQLite",
        text2: error.message || String(error),
        visibilityTime: 4000,
      });
    }
  }

  return (
    <SafeAreaView style={GLOBAL_STYLES.screen}>
      <View style={{ padding: SPACING.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>  // botão de teste do CRUD no banco local (SQLite) - só para teste
          <Text style={GLOBAL_STYLES.title}>Meus Robôs</Text>

          // BOTÃO DE TESTE RÁPIDO DO CRUD NO BANCO LOCAL (SQLite) - APENAS PARA TESTES
          <TouchableOpacity 
            style={[GLOBAL_STYLES.buttonSecondary, { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm }]} 
            onPress={testarCRUD}
          >
            <Text style={[GLOBAL_STYLES.buttonSecondaryText, { fontSize: 12 }]}>Testar DB</Text>
          </TouchableOpacity>
        </View>

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.sm }]}>
            Conectando aos robôs...
          </Text>
        </View>
      ) : (
        <FlatList
          data={listaFiltrada}
          renderItem={renderItem}
          keyExtractor={(item) => item.uuid_dispositivo}
          contentContainerStyle={{ padding: SPACING.lg }}
          ListFooterComponent={renderAddCard}
        />
      )}
    </SafeAreaView>
  );
}