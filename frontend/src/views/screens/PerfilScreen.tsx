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
import { COLORS, GLOBAL_STYLES } from "../../shared/styles/globalStyles";
import { styles } from "../../styles/perfilStyles";
import { usePerfil } from "../../hooks/usePerfil";
// pego os dados do usuário logado do contexto de autenticação
import { useAuth } from "../../context/AuthContext";

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

// SCREEN
export default function PerfilScreen({ navigation }: { navigation?: any }) {
  // agora pego os dados do usuário do AuthContext em vez do AsyncStorage
  const { usuario: usuarioAuth } = useAuth();

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
    //aqui criei a tela de perfil do usuário, onde ele pode visualizar e editar suas informações pessoais, como nome, email e telefone.
    //  O usuário também pode alterar sua senha através de um modal dedicado. A tela é organizada em seções para facilitar a navegação,
    //  e cada campo tem um estilo consistente para melhorar a experiência do usuário. O botão de salvar alterações fica desativado 
    // enquanto as alterações estão sendo salvas para evitar ações duplicadas, e o usuário recebe feedback visual sobre o status da ação.
    <SafeAreaView style={GLOBAL_STYLES.safeArea}>
      <ScrollView
        style={GLOBAL_STYLES.screen}
        contentContainerStyle={GLOBAL_STYLES.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* aqui no header da tela de perfil, com um botão de voltar para retornar à tela anterior e o título "Perfil".
         O header é estilizado para se destacar do restante do conteúdo e fornecer uma navegação clara para o usuário. O botão de 
         voltar tem um ícone representativo e uma área de toque adequada para facilitar a interação. */}
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

        {/* o avatar do usuário, que exibe a foto de perfil se disponível ou um ícone genérico caso contrário. O nome e email do
         usuário são exibidos abaixo do avatar, com estilos distintos para destacar as informações. O layout é centralizado para 
         criar uma apresentação visualmente agradável e fácil de ler. */}
        <View style={styles.avatarSection}>
          {usuario?.foto_perfil ? (
            <Image
              source={{ uri: usuario.foto_perfil }}
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

        {/*aqui tem as informações do perfil, como nome, email e telefone. O nome e telefone são editáveis, enquanto o email é 
        apenas leitura. Cada campo tem um ícone representativo e um estilo consistente para facilitar a leitura e a interação.
         O usuário pode clicar em cada campo para editar as informações, e as alterações são salvas quando o usuário clica no botão
          "Salvar alterações".*/}
        <View style={[GLOBAL_STYLES.cardNoPadding, styles.sectionContainer]}>
          {/*aqui o nome, que é editável. O usuário pode clicar no campo de nome para editar seu nome, e as alterações são salvas 
          quando o usuário clica no botão "Salvar alterações". O campo de nome tem um ícone representativo e um estilo consistente
           para facilitar a leitura e a interação.*/}
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

          {/* aqui o email, que é apenas leitura. O campo de email exibe o email do usuário, mas não pode ser editado. Ele tem um 
          ícone representativo e um estilo consistente para facilitar a leitura. Se o email não estiver disponível, será exibido 
          um texto padrão. */}
          <InfoRow
            label="Email"
            value={usuario?.email || "-"}
            icon="mail-outline"
          />

          {/*aqui o telefone, que é editável. O usuário pode clicar no campo de telefone para editar seu número de telefone, e as 
          alterações são salvas quando o usuário clica no botão "Salvar alterações". O campo de telefone tem um ícone representativo 
          e um estilo consistente para facilitar a leitura e a interação. O teclado é configurado para entrada de telefone,
           facilitando a digitação do número.*/}
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

        {/* temos o botão "Salvar alterações", que o usuário pode clicar para salvar as alterações feitas no perfil. O botão tem um 
        ícone de checkmark e um texto, e fica com uma opacidade reduzida enquanto as alterações estão sendo salvas para indicar que
         a ação está em andamento. Se o usuário clicar no botão, será exibido um alerta de confirmação antes de salvar as alterações. */}
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

        {/* aqui no modal de alteração de senha, onde o usuário pode digitar uma nova senha para sua conta. O modal tem um título, 
        uma descrição e um campo de entrada para a nova senha. O usuário pode cancelar a ação ou salvar a nova senha, e enquanto a 
        senha está sendo salva, o botão de salvar fica desativado e exibe um indicador de carregamento. */}
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
                style={[GLOBAL_STYLES.input, styles.input, { marginBottom: 16 }]}
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

        {/*temos as ações adicionais, como alterar senha e excluir conta. Essas ações são apresentadas em um card separado para 
        destacar sua importância. O botão de alterar senha abre um modal onde o usuário pode digitar uma nova senha, e o botão de 
        excluir conta pode ser implementado para solicitar confirmação antes de excluir a conta do usuário. Enquanto as ações estão 
        sendo processadas, os botões ficam desativados e exibem um indicador de carregamento para informar o usuário. */}
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

        {/* aqui o rodapé da tela de perfil, com o nome e versão do aplicativo. O rodapé é estilizado para se destacar do 
        restante do conteúdo e fornecer informações importantes sobre a versão do app. */}
        <Text style={GLOBAL_STYLES.footer}>Gerenciamento de conta</Text>
      </ScrollView>
    </SafeAreaView>
  );
}