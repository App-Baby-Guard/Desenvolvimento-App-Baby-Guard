import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, SPACING, BORDER_RADIUS } from "../../shared/styles/globalStyles";
import { getStyles } from "../../styles/meusRobosStyles";

import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/RootNavigator";

import { roboController } from "../../controllers/roboController";
import { Dispositivo } from "../../models/Dispositivo";
import Toast from "react-native-toast-message";
import { useTheme } from "../../context/ThemeContext";
import * as dispositivosService from "../../services/dispositivosService";


type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MeusRobosScreen() {
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const [busca, setBusca] = useState("");
  const [robos, setRobos] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

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

  function confirmarRemover(uuid: string, nome: string) {
    // [COMPATIBILIDADE MULTIPLATAFORMA]
    // Eu identifiquei um erro grave aqui: o componente `Alert.alert` do React Native 
    // trava a aplicação quando tentamos rodar o app direto no Navegador (Web).
    // Por conta disso, eu criei essa condição onde, se o sistema operacional for 'web', chamamos a função nativa do 
    // Javascript (window.confirm). Se for um celular de verdade, mantive o balão padrão do Alert.
    if (Platform.OS === 'web') {
      if (window.confirm(`Tem certeza que deseja excluir o robô "${nome}"? Esta ação não pode ser desfeita.`)) {
        handleRemover(uuid, nome);
      }
    } else {
      Alert.alert(
        "Excluir Robô",
        `Tem certeza que deseja excluir o robô "${nome}"? Esta ação não pode ser desfeita.`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive", 
            onPress: () => handleRemover(uuid, nome) 
          }
        ]
      );
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
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => {
          navigation.getParent()?.navigate("RoboDetalhes", {
            id: item.uuid_dispositivo,
            nome: item.nome_dispositivo,
            local: undefined,
          });
        }}
      >
        {/* Informações principais do robô (Esquerda) */}
        <View style={{ flex: 1, paddingRight: SPACING.md }}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.nome_dispositivo}
          </Text>
          <Text style={styles.cardUuid} numberOfLines={1}>
            {item.uuid_dispositivo}
          </Text>
          <View style={{ marginTop: SPACING.sm }}>
            {renderStatus(item.status_dispositivo)}
          </View>
        </View>

        {/* Ícones de ação (Direita) */}
        <View style={{ flexDirection: "row", gap: SPACING.sm }}>
          <TouchableOpacity
            style={styles.actionBtnEdit}
            onPress={() => {
              navigation.getParent()?.navigate("RenomearRobo", {
                id: item.uuid_dispositivo,
                nome: item.nome_dispositivo,
              });
            }}
          >
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.getParent()?.navigate("RoboDetalhes", {
                id: item.uuid_dispositivo,
                nome: item.nome_dispositivo,
                local: undefined,
              });
            }}
          >
            <Ionicons name="information-circle" size={22} color={COLORS.textInverse} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnDelete}
            onPress={() => confirmarRemover(item.uuid_dispositivo, item.nome_dispositivo)}
          >
            <Ionicons name="trash" size={20} color="#c0392b" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  // Card fixo para adicionar novo robô
  function renderAddCard() {
    return (
      <View style={styles.addCard}>
        <Text style={styles.addCardTitle}>Novo Robô</Text>
        <Text style={styles.addCardSubtitle}>Aguardando configuração</Text>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.xl,
            borderRadius: BORDER_RADIUS.md,
            alignItems: "center",
            marginTop: SPACING.lg,
          }}
          onPress={() => {
            navigation.getParent()?.navigate("NovoRobo");
          }}
        >
          <Text style={{ color: COLORS.textInverse, fontWeight: "700", fontSize: 14 }}>
            Configurar agora
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const listaFiltrada = robos.filter((r) =>
    r.nome_dispositivo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Robôs</Text>
      </View>

      <TextInput
        placeholder="Buscar robô..."
        placeholderTextColor={getStyles(isDarkMode).loadingText.color as string}
        style={styles.searchInput}
        value={busca}
        onChangeText={setBusca}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: getStyles(isDarkMode).screen.backgroundColor }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Conectando aos robôs...</Text>
        </View>
      ) : (
        <FlatList
          data={listaFiltrada}
          renderItem={renderItem}
          keyExtractor={(item) => item.uuid_dispositivo}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderAddCard}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}