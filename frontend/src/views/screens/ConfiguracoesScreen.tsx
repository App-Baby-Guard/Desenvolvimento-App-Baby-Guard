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
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL_STYLES } from "../../shared/styles/globalStyles";
import { styles } from "../../styles/configuracoesStyles";
// importei o contexto de autenticação para pegar o token e os dados do usuário logado
import { useAuth } from '../../context/AuthContext';
// importei o serviço de logout para invalidar o token na API
import { logoutApi } from '../../services/authService';

// TYPES
interface SensorLimit {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  range: string;
  description: string;
}

// ICONES
//aqui defini cores e ícones para os limites dos sensores, para deixar a interface mais visual e intuitiva
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
//aqui criei um componente reutilizável para os títulos das seções, que pode receber um título, 
// um rótulo de ação e uma função de callback para quando a ação for pressionada. Isso ajuda a manter o código 
// mais organizado e evita repetição.
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
//aqui criei um componente com temas claro e escuro para as linhas de configuração que possuem um switch,
//  como os alertas e o tema escuro.
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
//aqui eu criei um componente para exibir os limites dos sensores, mostrando o ícone, o nome, a descrição e a faixa ideal.

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
//aqui é a tela principal de configurações, onde utilizo os componentes criados acima para organizar as seções de conta, 
// notificações, limites dos sensores e dispositivo. Também implementei a função de logout, que exibe um alerta de confirmação e,
//  ao confirmar, tenta invalidar o token na API e limpa a sessão local.
export default function ConfiguracoesScreen({
  navigation,
}: {
  navigation?: any;
}) {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  // pego o token, usuário e função de limpar sessão do contexto de autenticação
  // agora não preciso mais do AsyncStorage para isso
  const { token, usuario, limparSessao } = useAuth();

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
          // tenta invalidar o token na API, mesmo se falhar desloga localmente
          if (token) {
            try {
              await logoutApi(token);
            } catch {
              console.log("Erro ao invalidar token na API, deslogando localmente.");
            }
          }
          // limpa os dados da sessão no app
          limparSessao();
          // volta para a tela de login
          navigation?.reset({ index: 0, routes: [{ name: 'Login' }] });
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
          {/*aqui header da tela de configurações, com um botão de voltar e o título centralizado. O botão de voltar
           utiliza a função de navegação para retornar à tela anterior. O título é estilizado para se destacar como o cabeçalho 
           da tela.*/}
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

        {/*aqui conta as informações da conta do usuário, como nome, email e foto de perfil. O usuário pode
         clicar nessa seção para acessar a tela de perfil, onde pode editar suas informações. Também tem um botão para sair da conta,
          que chama a função de logout definida acima.*/}
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
                source={{ uri: usuario.foto_perfil }}
                style={styles.accountAvatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={COLORS.primaryDark} />
              </View>
            )}

            <View style={{ flex: 1 }}>
              {/* mostra o nome e email real do usuário logado */}
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

        {/*aqui as configurações de notificações, onde o usuário pode ativar ou desativar os alertas, escolher se quer som de alerta e ativar
         o tema escuro. Cada opção tem um
         ícone representativo e um switch para ligar ou desligar. As opções são organizadas em uma seção separada para facilitar 
         a navegação.*/}
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

        {/* aqui limites dos sensores, onde mostro os limites de temperatura e umidade, com ícones, 
        descrições e faixas ideais. O usuário pode clicar em "Ajustar" para configurar esses limites, o que pode levar a uma tela de 
        configuração avançada. */}
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

        {/*aqui no dispositivo mostro as informações do dispositivo conectado, como nome, status de conexão, versão do firmware
         e última sincronização. O usuário pode clicar nessa seção para acessar a tela de dispositivos, onde pode gerenciar
          seus dispositivos conectados. Também tem um ícone de atualização para verificar se há novas versões de firmware disponíveis.*/}
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

        {/*aqui o rodapé da tela de configurações, com o nome e versão do aplicativo. O rodapé é estilizado para se
         destacar do restante do conteúdo e fornecer informações importantes sobre a versão do app.*/}
        <Text style={GLOBAL_STYLES.footer}>BabyGuard v2.4.0 (2023)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}