import React, { useEffect, useState } from "react";

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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, GLOBAL_STYLES } from "../../shared/styles/globalStyles";
import { styles } from "../../styles/perfilStyles";

import { usePerfil } from "../../hooks/usePerfil";

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
      style={[
        GLOBAL_STYLES.iconWrap,
        {
          backgroundColor: COLORS.surfaceSoft,
          marginRight: 12,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={COLORS.primary} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={GLOBAL_STYLES.fieldLabel}>{label}</Text>

      <Text style={GLOBAL_STYLES.fieldValue}>{value}</Text>
    </View>
  </View>
);

// TYPES
type Usuario = {
  id_usuario: number;
  nome: string;
  email: string;
  telefone?: string;
  foto_perfil?: string;
};

// SCREEN
export default function PerfilScreen({ navigation }: { navigation?: any }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senhaModalVisivel, setSenhaModalVisivel] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuarioStorage = await AsyncStorage.getItem("usuario");

        if (usuarioStorage) {
          const usuarioParse = JSON.parse(usuarioStorage);

          setUsuario(usuarioParse);
          setNome(usuarioParse.nome || "");
          setTelefone(usuarioParse.telefone || "");
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      }
    }

    carregarUsuario();
  }, []);

  const { salvando, salvarPerfil, alterarSenha, salvandoSenha } = usePerfil({
    usuario,
    setUsuario,
    setNome,
    setTelefone,
  });

  const handleSalvarPerfil = async () => {
    try {
      await salvarPerfil(nome, telefone);

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
          {usuario?.foto_perfil ? (
            <Image
              source={{
                uri: usuario.foto_perfil,
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={42} color={COLORS.primaryDark} />
            </View>
          )}

          <Text style={styles.userName}>{nome || "Usuário"}</Text>

          <Text style={styles.userEmail}>
            {usuario?.email || "Email não encontrado"}
          </Text>
        </View>

        {/* INFORMAÇÕES */}
        <View style={[GLOBAL_STYLES.cardNoPadding, styles.sectionContainer]}>
          {/* NOME */}
          <View style={[GLOBAL_STYLES.rowPadding, GLOBAL_STYLES.rowBorder]}>
            <Text style={GLOBAL_STYLES.fieldLabel}>Nome</Text>

            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor={COLORS.textTertiary}
              style={[GLOBAL_STYLES.input, styles.input]}
            />
          </View>

          {/* EMAIL */}
          <InfoRow
            label="Email"
            value={usuario?.email || "-"}
            icon="mail-outline"
          />

          {/* TELEFONE */}
          <View style={GLOBAL_STYLES.rowPadding}>
            <Text style={GLOBAL_STYLES.fieldLabel}>Telefone</Text>

            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Seu telefone"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="phone-pad"
              style={[GLOBAL_STYLES.input, styles.input]}
            />
          </View>
        </View>

        {/* BOTÃO SALVAR */}
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

        {/* MODAL SENHA */}
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
                placeholderTextColor={COLORS.textTertiary}
                secureTextEntry
                style={[
                  GLOBAL_STYLES.input,
                  styles.input,
                  { marginBottom: 16 },
                ]}
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

        {/* AÇÕES */}
        <View style={styles.actionCard}>
          <TouchableOpacity
            style={[
              GLOBAL_STYLES.row,
              GLOBAL_STYLES.rowPadding,
              GLOBAL_STYLES.rowBorder,
              salvando && { opacity: 0.6 },
            ]}
            activeOpacity={0.7}
            onPress={() => setSenhaModalVisivel(true)}
            disabled={salvando}
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
