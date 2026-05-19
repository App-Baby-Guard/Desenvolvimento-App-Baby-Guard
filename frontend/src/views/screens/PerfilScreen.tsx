import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL_STYLES } from "../../shared/styles/globalStyles";
import { styles } from "../../styles/perfilStyles";

// MOCK
const USER = {
  nome: "Ricardo Silva",
  email: "ricardo.silva@hotmail.com",
  telefone: "(32)99999-9910",
  foto: null,
};

// ROW
const InfoRow = ({
  label,
  value,
  icon,
  isLast = false,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
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
      style={[GLOBAL_STYLES.iconWrap, { backgroundColor: COLORS.surfaceSoft }]}
    >
      <Ionicons name={icon} size={18} color={COLORS.primary} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={GLOBAL_STYLES.fieldLabel}>{label}</Text>
      <Text style={GLOBAL_STYLES.fieldValue}>{value}</Text>
    </View>
  </View>
);

// SCREEN
export default function PerfilScreen({ navigation }: { navigation?: any }) {
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

          <Text style={[GLOBAL_STYLES.title, styles.headerTitle]}>Perfil</Text>
        </View>

        {/* AVATAR */}
        <View style={styles.avatarSection}>
          {USER.foto ? (
            <Image source={{ uri: USER.foto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={42} color={COLORS.primaryDark} />
            </View>
          )}

          <Text style={styles.userName}>{USER.nome}</Text>
          <Text style={GLOBAL_STYLES.textMuted}>{USER.email}</Text>
        </View>

        {/* INFORMAÇÕES */}
        <View style={GLOBAL_STYLES.cardNoPadding}>
          <InfoRow label="Nome" value={USER.nome} icon="person-outline" />
          <InfoRow label="Email" value={USER.email} icon="mail-outline" />
          <InfoRow
            label="Telefone"
            value={USER.telefone}
            icon="call-outline"
            isLast
          />
        </View>

        {/* AÇÕES */}
        <View style={GLOBAL_STYLES.cardNoPadding}>
          <TouchableOpacity
            style={[
              GLOBAL_STYLES.row,
              GLOBAL_STYLES.rowPadding,
              GLOBAL_STYLES.rowBorder,
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.textPrimary}
            />
            <Text style={styles.actionText}>Alterar senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[GLOBAL_STYLES.row, GLOBAL_STYLES.rowPadding]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.deleteText}>Excluir conta</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <Text style={GLOBAL_STYLES.footer}>Gerenciamento de conta</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
