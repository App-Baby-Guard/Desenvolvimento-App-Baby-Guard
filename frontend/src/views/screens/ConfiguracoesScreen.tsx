//essa é a tela de configurações do aplicativo, onde o usuário pode gerenciar suas preferências, como notificações, limites dos
// sensores e informações do dispositivo.
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  Modal,
  TextInput
} from "react-native";
import { Switch as PaperSwitch } from "react-native-paper";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL_STYLES } from "../../shared/styles/globalStyles";
import { getStyles } from "../../styles/configuracoesStyles";
// importei o contexto de autenticação para pegar o token e os dados do usuário logado
import { useAuth } from '../../context/AuthContext';
// importei o contexto de tema para controlar o modo escuro globalmente
import { useTheme } from '../../context/ThemeContext';
// importei o serviço de logout para invalidar o token na API
import { logoutApi } from '../../services/authService';

// TYPES
interface SensorLimit {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  min: number;
  max: number;
  unit: string;
  description: string;
}

//aqui defini cores e ícones para os limites dos sensores, para deixar a interface mais visual e intuitiva
const SENSOR_LIMITS: SensorLimit[] = [
  {
    label: "Limite de Temperatura",
    icon: "thermometer-outline",
    iconColor: "#F5A623",
    iconBg: "#FFF4E0",
    min: 20,
    max: 26,
    unit: "°C",
    description: "Faixa ideal de segurança",
  },
  {
    label: "Limite de Umidade",
    icon: "water-outline",
    iconColor: "#4A90E2",
    iconBg: "#E6F0FA",
    min: 40,
    max: 60,
    unit: "%",
    description: "Nível de conforto",
  },
];

// HEADER — seções da tela de configurações
const SectionHeader = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <View style={GLOBAL_STYLES.sectionHeader}>
    <Text style={GLOBAL_STYLES.sectionTitle}>{title}</Text>

    {actionLabel && (
      <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
        <Text style={GLOBAL_STYLES.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// TOGGLE
const ToggleRow = ({
  icon,
  iconColor = COLORS.primary,
  label,
  value,
  onToggle,
  isLast = false,
  usePaperSwitch = false,
  styles,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  isLast?: boolean;
  usePaperSwitch?: boolean;
  styles: ReturnType<typeof getStyles>;
}) => (
  <View
    style={[
      { flexDirection: "row", alignItems: "center" },
      { paddingHorizontal: 16, paddingVertical: 12 },
      !isLast && styles.rowWithBorder,
      styles.rowBackground,
    ]}
  >
    <View
      style={[
        {
          width: 36,
          height: 36,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>

    <Text style={[styles.toggleLabel, { flex: 1 }]}>{label}</Text>

    {usePaperSwitch ? (
      <PaperSwitch
        value={value}
        onValueChange={onToggle}
        color={COLORS.primary}
      />
    ) : (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: COLORS.border,
          true: COLORS.primary,
        }}
        thumbColor={COLORS.surface}
        ios_backgroundColor={COLORS.border}
      />
    )}
  </View>
);

// SENSOR
    const SensorLimitRow = ({
      item,
      isLast = false,
      styles,
    }: {
      item: SensorLimit;
      isLast?: boolean;
      styles: ReturnType<typeof getStyles>;
    }) => (
      <View
        style={[
          { flexDirection: "row", alignItems: "center" },
          styles.sensorRow,
          { paddingHorizontal: 16, paddingVertical: 12 },
          !isLast && styles.rowWithBorder,
        ]}
      >
        <View
          style={[
            {
              width: 36,
              height: 36,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            },
            { backgroundColor: item.iconBg },
          ]}
        >
          <Ionicons name={item.icon} size={18} color={item.iconColor} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.label}</Text>
          <Text style={styles.userEmail}>{item.description}</Text>
        </View>

        <View style={styles.sensorRange}>
          <Text style={styles.sensorRangeText}>
            {item.min}
            {item.unit}
            {" - "}
            {item.max}
            {item.unit}
          </Text>
        </View>
      </View>
    );

// SCREEN
export default function ConfiguracoesScreen({
  navigation,
}: {
  navigation?: any;
}) {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [limitesSensores, setLimitesSensores] =
    useState<SensorLimit[]>(SENSOR_LIMITS);

  const [modalLimitesVisible, setModalLimitesVisible] = useState(false);

  const [sensorSelecionado, setSensorSelecionado] =
    useState<SensorLimit | null>(null);

  const [valorMinimo, setValorMinimo] = useState("");

  const [valorMaximo, setValorMaximo] = useState("");

  // pego o token, usuário e função de limpar sessão do contexto de autenticação
  const { token, usuario, limparSessao } = useAuth();

  const { isDarkMode, toggleDarkMode } = useTheme();

  // todos os estilos vêm do arquivo separado, nenhum inline style no screen
  const styles = getStyles(isDarkMode);

  const abrirEdicaoLimite = (sensor: SensorLimit) => {
  setSensorSelecionado(sensor);
  setValorMinimo(String(sensor.min));
  setValorMaximo(String(sensor.max));
};

const salvarLimite = () => {
  if (!sensorSelecionado) return;

  const minimo = Number(valorMinimo);
  const maximo = Number(valorMaximo);

  if (isNaN(minimo) || isNaN(maximo)) {
    Alert.alert("Erro", "Informe valores válidos.");
    return;
  }

  if (minimo > maximo) {
    Alert.alert(
      "Erro",
      "O valor mínimo não pode ser maior que o máximo."
    );
    return;
  }

  setLimitesSensores((prev) =>
    prev.map((sensor) =>
      sensor.label === sensorSelecionado.label
        ? {
            ...sensor,
            min: minimo,
            max: maximo,
          }
        : sensor
    )
  );
  setSensorSelecionado(null);
  setModalLimitesVisible(false);
};

  // função de logout: invalida o token na API e limpa a sessão local
  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          if (token) {
            try {
              await logoutApi(token);
            } catch {
              console.log("Erro ao invalidar token na API, deslogando localmente.");
            }
          }
          limparSessao();
          navigation?.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={GLOBAL_STYLES.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={GLOBAL_STYLES.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={styles.headerTitle.color as string}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Configurações</Text>
        </View>

        {/* CONTA */}
        <SectionHeader title="CONTA" />

        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={[
              { flexDirection: "row", alignItems: "center" },
              styles.accountRow,
              { paddingHorizontal: 16, paddingVertical: 12 },
              styles.rowWithBorder,
              styles.rowBackground,
            ]}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate("Perfil")}
          >
            {usuario?.foto_perfil ? (
              <Image
                source={{ uri: usuario.foto_perfil }}
                style={styles.accountAvatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={COLORS.primaryDark} />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{usuario?.nome || "Usuário"}</Text>
              <Text style={styles.userEmail}>
                {usuario?.email || "Email não encontrado"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={styles.userEmail.color as string}
            />
          </TouchableOpacity>

    
        </View>

        {/* NOTIFICAÇOES */}
        <SectionHeader title="NOTIFICAÇÕES" />

        <View style={styles.sectionCard}>
          <ToggleRow
            icon="notifications-outline"
            label="Ativar alertas"
            value={alertsEnabled}
            onToggle={setAlertsEnabled}
            styles={styles}
          />

          <ToggleRow
            icon="volume-medium-outline"
            label="Som de alerta"
            value={soundEnabled}
            onToggle={setSoundEnabled}
            styles={styles}
          />

          <ToggleRow
            icon="moon-outline"
            label="Tema Escuro"
            value={isDarkMode}
            onToggle={toggleDarkMode}
            isLast
            usePaperSwitch
            styles={styles}
          />
        </View>

        {/* LIMITES */}
        <SectionHeader
          title="LIMITES DOS SENSORES"
          actionLabel="Ajustar"
          onAction={() => setModalLimitesVisible(true)}
        />

        <View style={styles.sectionCard}>
          {limitesSensores.map((item, idx) => (
            <View key={item.label}>
              <SensorLimitRow
                item={item}
                isLast={idx === limitesSensores.length - 1}
                styles={styles}
              />
            </View>
          ))}
        </View>

        {/* DISPOSITIVOS */}
        <SectionHeader title="OUTROS" />

        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={[GLOBAL_STYLES.deviceField, styles.rowBackground]}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate("Robôs")}
          >
            <Text style={styles.fieldLabelThemed}>DISPOSITIVOS</Text>

            <View style={GLOBAL_STYLES.spaceBetween}>
              <Text style={styles.fieldValueThemed}>Visualizar Dispositivos</Text>

              <View style={styles.deviceStatus}>
                <View style={styles.statusDot} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={[GLOBAL_STYLES.deviceField, styles.rowWithBorder, styles.rowBackground]}>
            <Text style={styles.fieldLabelThemed}>VERSÃO DO FIRMWARE</Text>

            <View style={GLOBAL_STYLES.spaceBetween}>
              <Text style={styles.fieldValueThemed}>v1.2.3</Text>

              <Ionicons
                name="refresh-outline"
                size={18}
                color={styles.fieldLabelThemed.color as string}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              { flexDirection: "row", alignItems: "center" },
              styles.logoutRow,
              { paddingHorizontal: 16 },
            ]}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* FOOTER */}
      <Text style={styles.footerThemed}>BabyGuard v1.4.0 (2026)</Text>

      {/* MODAL LISTA DE SENSORES */}
      <Modal
        visible={modalLimitesVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalLimitesVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={GLOBAL_STYLES.spaceBetween}>
              <Text style={styles.modalTitle}>Ajustar Limites</Text>
              <TouchableOpacity onPress={() => setModalLimitesVisible(false)}>
                <Ionicons name="close" size={22} color={styles.headerTitle.color as string} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {limitesSensores.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.8}
                  onPress={() => {
                    abrirEdicaoLimite(item);
                    setModalLimitesVisible(false);
                  }}
                >
                  <SensorLimitRow item={item} isLast={idx === limitesSensores.length - 1} styles={styles} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!sensorSelecionado}
        animationType="fade"
        transparent
        onRequestClose={() => setSensorSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Limite</Text>

            <View style={styles.modalInputSection}>
              <Text style={styles.modalInputSectionTitle}>{sensorSelecionado?.label}</Text>

              <View style={styles.modalRowInputContainer}>
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Mínimo ({sensorSelecionado?.unit})</Text>
                  <TextInput
                    value={valorMinimo}
                    onChangeText={setValorMinimo}
                    keyboardType="numeric"
                    style={styles.modalTextInput}
                  />
                </View>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Máximo ({sensorSelecionado?.unit})</Text>
                  <TextInput
                    value={valorMaximo}
                    onChangeText={setValorMaximo}
                    keyboardType="numeric"
                    style={styles.modalTextInput}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalActionButtons}>
              <TouchableOpacity onPress={() => setSensorSelecionado(null)} style={styles.modalBtnCancel}>
                <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => salvarLimite()} style={styles.modalBtnSave}>
                <Text style={styles.modalBtnTextSave}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}