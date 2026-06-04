//essa tela de perfil do usuário, onde ele pode visualizar e editar suas informações pessoais, como nome, email e telefone. 
// O usuário também pode alterar sua senha através de um modal dedicado. A tela é organizada em seções para facilitar a navegação, 
// e cada campo tem um estilo consistente para melhorar a experiência do usuário. O botão de salvar alterações fica desativado
//  enquanto as alterações estão sendo salvas para evitar ações duplicadas, e o usuário recebe feedback visual sobre o status da ação.
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../shared/styles/globalStyles";
import { getStyles } from "../../styles/perfilStyles";
import { usePerfil } from "../../hooks/usePerfil";
// pego os dados do usuário logado do contexto de autenticação
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as ImagePicker from "expo-image-picker";

// ROW
const InfoRow = ({
  label,
  value,
  icon,
  isLast = false,
  styles,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
  styles: ReturnType<typeof getStyles>;
}) => (
  <View
    style={[
      styles.infoRowBg,
      { flexDirection: "row", alignItems: "center" },
      { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
      !isLast && styles.rowBorderThemed,
    ]}
  >
    <View
      style={[
        {
          width: 36,
          height: 36,
          borderRadius: BORDER_RADIUS.sm,
          alignItems: "center",
          justifyContent: "center",
          marginRight: SPACING.md,
        },
        styles.iconWrapBg,
      ]}
    >
      <Ionicons name={icon} size={18} color={COLORS.primary} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  </View>
);

// SCREEN
export default function PerfilScreen({ navigation }: { navigation?: any }) {
  // agora pego os dados do usuário do AuthContext em vez do AsyncStorage
  const { usuario: usuarioAuth } = useAuth();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [usuario, setUsuario] = useState(usuarioAuth);
  const [nome, setNome] = useState(usuarioAuth?.nome || "");
  const [telefone, setTelefone] = useState(usuarioAuth?.telefone || "");
  const [senhaModalVisivel, setSenhaModalVisivel] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");

  const { salvando, salvarPerfil, alterarSenha, salvandoSenha } = usePerfil({
    usuario,
    setUsuario,
    setNome,
    setTelefone,
  });

  const handleSalvarPerfil = async () => {
    try {
      await salvarPerfil(nome, telefone, fotoPerfil);

      Alert.alert(
        "Salvar alterações",
        "Deseja realmente salvar as alterações do perfil?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Salvar",
            onPress: () => {
              Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
            },
          },
        ],
      );
    } catch (error: any) {
      console.log("Erro ao salvar perfil:", error);
      Alert.alert(
        "Erro",
        error?.message || "Não foi possível atualizar o perfil.",
      );
    }
  };

  const handleAlterarSenha = async () => {
    if (!novaSenha.trim()) {
      Alert.alert("Atenção", "Digite uma nova senha.");
      return;
    }

    try {
      await alterarSenha(novaSenha.trim());
      Alert.alert("Sucesso", "Senha alterada com sucesso.");
      setNovaSenha("");
      setSenhaModalVisivel(false);
    } catch (error: any) {
      console.log("Erro ao alterar senha:", error);
      Alert.alert(
        "Erro",
        error?.message || "Não foi possível alterar a senha.",
      );
    }
  };

  const [fotoPerfil, setFotoPerfil] = useState(
  usuarioAuth?.foto_perfil || "",
);

  const selecionarFoto = async () => {
  const permissao =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissao.granted) {
    Alert.alert(
      "Permissão necessária",
      "Permita acesso à galeria.",
    );
    return;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true,
  });

  if (!resultado.canceled) {
    const imagem = resultado.assets[0];

    setFotoPerfil(
      `data:image/jpeg;base64,${imagem.base64}`,
    );
  }
};

  return (
    //aqui criei a tela de perfil do usuário, onde ele pode visualizar e editar suas informações pessoais, como nome, email e telefone.
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{ padding: SPACING.md, marginRight: SPACING.sm }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={styles.headerTitle.color as string}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Perfil</Text>
        </View>

        {/* Avatar e dados do usuário */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={selecionarFoto}
          >
            {fotoPerfil ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons
                  name="person"
                  size={42}
                  color={COLORS.primaryDark}
                />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>{nome || "Usuário"}</Text>
          <Text style={styles.userEmail}>
            {usuario?.email || "Email não encontrado"}
          </Text>

          </View>

        {/* Campos editáveis: nome e telefone */}
        <View style={styles.sectionContainer}>
          <View style={[styles.rowPaddingThemed, styles.rowBorderThemed]}>
            <Text style={styles.fieldLabel}>Nome</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor={styles.fieldLabel.color as string}
              style={styles.input}
            />
          </View>

          {/* Email apenas leitura */}
          <InfoRow
            label="Email"
            value={usuario?.email || "-"}
            icon="mail-outline"
            styles={styles}
          />

          {/* Telefone editável */}
          <View style={styles.rowPaddingThemed}>
            <Text style={styles.fieldLabel}>Telefone</Text>
            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Seu telefone"
              placeholderTextColor={styles.fieldLabel.color as string}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        </View>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.saveButton, salvando && { opacity: 0.7 }]}
          activeOpacity={0.85}
          onPress={handleSalvarPerfil}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={COLORS.textInverse}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Modal de alteração de senha */}
        <Modal
          visible={senhaModalVisivel}
          transparent
          animationType="fade"
          onRequestClose={() => setSenhaModalVisivel(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIcon}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.modalTitle}>Alterar senha</Text>
              </View>

              <Text style={styles.modalDescription}>
                Digite uma nova senha segura para proteger sua conta.
              </Text>

              <TextInput
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Digite a nova senha"
                placeholderTextColor={styles.fieldLabel.color as string}
                secureTextEntry
                style={[styles.input, { marginBottom: 16 }]}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setSenhaModalVisivel(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAlterarSenha}
                  style={styles.confirmButton}
                  disabled={salvandoSenha}
                >
                  <Text style={styles.confirmButtonText}>
                    {salvandoSenha ? "Salvando..." : "Salvar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Ações: alterar senha e excluir conta */}
        <View style={styles.actionCard}>
          <TouchableOpacity
            style={[
              { flexDirection: "row", alignItems: "center" },
              { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
              styles.actionRowBorder,
              { borderBottomWidth: 1 },
              salvando && { opacity: 0.6 },
            ]}
            activeOpacity={0.7}
            onPress={() => setSenhaModalVisivel(true)}
            disabled={salvando}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={styles.actionText.color as string}
            />
            <Text style={styles.actionText}>Alterar senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              { flexDirection: "row", alignItems: "center" },
              { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.deleteText}>Excluir conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Gerenciamento de conta</Text>
      </ScrollView>
    </SafeAreaView>
  );
}