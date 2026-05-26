import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { COLORS, GLOBAL_STYLES } from "../../shared/styles/globalStyles";

import { styles } from "../../styles/configuracoesStyles";

// TYPES
interface SensorLimit {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  range: string;
  description: string;
}

type Usuario = {
  nome: string;
  email: string;
  telefone?: string;
  foto_perfil?: string;
};

// ICONES
const SENSOR_LIMITS: SensorLimit[] = [
  {
    label: "Limite de Temperatura",
    icon: "thermometer-outline",
    iconColor: "#F5A623",
    iconBg: "#FFF4E0",
    range: "20°C – 26°C",
    description: "Faixa ideal de segurança",
  },
  {
    label: "Limite de Umidade",
    icon: "water-outline",
    iconColor: "#4A90E2",
    iconBg: "#E6F0FA",
    range: "40% – 60%",
    description: "Nível de conforto",
  },
];

// HEADER
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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  isLast?: boolean;
}) => (
  <View
    style={[
      GLOBAL_STYLES.row,
      GLOBAL_STYLES.rowPadding,
      !isLast && GLOBAL_STYLES.rowBorder,
    ]}
  >
    <View
      style={[
        GLOBAL_STYLES.iconWrap,
        {
          backgroundColor: COLORS.surfaceSoft,
          marginRight: 12,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>

    <Text
      style={[
        GLOBAL_STYLES.rowLabel,
        {
          fontWeight: "600",
        },
      ]}
    >
      {label}
    </Text>

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
  </View>
);

// SENSOR
const SensorLimitRow = ({
  item,
  isLast = false,
}: {
  item: SensorLimit;
  isLast?: boolean;
}) => (
  <View
    style={[
      GLOBAL_STYLES.row,
      styles.sensorRow,
      GLOBAL_STYLES.rowPadding,
      !isLast && GLOBAL_STYLES.rowBorder,
    ]}
  >
    <View
      style={[
        GLOBAL_STYLES.iconWrap,
        {
          backgroundColor: item.iconBg,
        },
      ]}
    >
      <Ionicons name={item.icon} size={18} color={item.iconColor} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.userName}>{item.label}</Text>

      <Text style={styles.userEmail}>{item.description}</Text>
    </View>

    <View style={styles.sensorRange}>
      <Text style={styles.sensorRangeText}>{item.range}</Text>
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

  const [darkTheme, setDarkTheme] = useState(false);

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const carregarUsuario = async () => {
        try {
          const usuarioStorage = await AsyncStorage.getItem("usuario");

          if (usuarioStorage && isActive) {
            setUsuario(JSON.parse(usuarioStorage));
          }
        } catch (error) {
          console.log("Erro ao carregar usuário:", error);
        }
      };

      carregarUsuario();

      return () => {
        isActive = false;
      };
    }, []),
  );

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
          try {
            await AsyncStorage.removeItem("token");

            await AsyncStorage.removeItem("usuario");

            navigation?.replace("Login");
          } catch (error) {
            console.log("Erro ao sair:", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={GLOBAL_STYLES.safeArea}>
      <ScrollView
        style={GLOBAL_STYLES.screen}
        contentContainerStyle={GLOBAL_STYLES.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={GLOBAL_STYLES.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={GLOBAL_STYLES.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <Text style={[GLOBAL_STYLES.title, styles.headerTitle]}>
            Configurações
          </Text>
        </View>

        {/* CONTA */}
        <SectionHeader title="CONTA" />

        <View style={[GLOBAL_STYLES.cardNoPadding, styles.sectionCard]}>
          <TouchableOpacity
            style={[
              GLOBAL_STYLES.row,
              GLOBAL_STYLES.rowPadding,
              GLOBAL_STYLES.rowBorder,
              styles.accountRow,
            ]}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate("Perfil")}
          >
            {usuario?.foto_perfil ? (
              <Image
                source={{
                  uri: usuario.foto_perfil,
                }}
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
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GLOBAL_STYLES.row,
              GLOBAL_STYLES.rowPadding,
              styles.logoutRow,
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

        {/* NOTIFICAÇÕES */}
        <SectionHeader title="NOTIFICAÇÕES" />

        <View style={[GLOBAL_STYLES.cardNoPadding, styles.sectionCard]}>
          <ToggleRow
            icon="notifications-outline"
            label="Ativar alertas"
            value={alertsEnabled}
            onToggle={setAlertsEnabled}
          />

          <ToggleRow
            icon="volume-medium-outline"
            label="Som de alerta"
            value={soundEnabled}
            onToggle={setSoundEnabled}
          />

          <ToggleRow
            icon="moon-outline"
            label="Tema Escuro"
            value={darkTheme}
            onToggle={setDarkTheme}
            isLast
          />
        </View>

        {/* LIMITES DOS SENSORES */}
        <SectionHeader
          title="LIMITES DOS SENSORES"
          actionLabel="Ajustar"
          onAction={() => {}}
        />

        <View style={[GLOBAL_STYLES.cardNoPadding, styles.sectionCard]}>
          {SENSOR_LIMITS.map((item, idx) => (
            <SensorLimitRow
              key={item.label}
              item={item}
              isLast={idx === SENSOR_LIMITS.length - 1}
            />
          ))}
        </View>

        {/* DISPOSITIVO */}
        <SectionHeader title="DISPOSITIVO" />

        <View style={[GLOBAL_STYLES.cardNoPadding, styles.sectionCard]}>
          <TouchableOpacity
            style={GLOBAL_STYLES.deviceField}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate("MeusRobos")}
          >
            <Text style={GLOBAL_STYLES.fieldLabel}>DISPOSITIVOS</Text>

            <View style={GLOBAL_STYLES.spaceBetween}>
              <Text style={styles.fieldValueDisp}>ESP32-BG-001</Text>

              <View style={styles.deviceStatus}>
                <View style={styles.statusDot} />

                <Text style={styles.statusText}>Conectado e sincronizado</Text>
              </View>

              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ATIVO</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={[GLOBAL_STYLES.deviceField, GLOBAL_STYLES.rowBorder]}>
            <Text style={GLOBAL_STYLES.fieldLabel}>VERSÃO DO FIRMWARE</Text>

            <View style={GLOBAL_STYLES.spaceBetween}>
              <Text style={GLOBAL_STYLES.fieldValue}>v1.2.3</Text>

              <Ionicons
                name="refresh-outline"
                size={18}
                color={COLORS.textTertiary}
              />
            </View>
          </View>

          <View style={GLOBAL_STYLES.deviceField}>
            <Text style={GLOBAL_STYLES.fieldLabel}>ÚLTIMA SINCRONIZAÇÃO</Text>

            <Text style={GLOBAL_STYLES.fieldValue}>Há 2 minutos</Text>
          </View>
        </View>

        {/* FOOTER */}
        <Text style={GLOBAL_STYLES.footer}>BabyGuard v2.4.0 (2023)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
