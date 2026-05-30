
// Tela de cadastro do app. O layout é igual ao da LoginScreen para manter consistência visual.
// A lógica valida os campos e envia os dados para a API de cadastro.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../routes/RootNavigator";
import { cadastrarApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../shared/styles/globalStyles";
//aqui definimos os tipos de navegação para a tela de cadastro, indicando que ela faz parte do stack de navegação e 
// pode navegar para outras telas como "Login" ou "Tabs".
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};
//criei a constante RegisterScreen, que é um componente funcional do React.
// Ele recebe as props de navegação para permitir a transição entre telas.
const RegisterScreen: React.FC<Props> = ({ navigation }) => { //usei react.FC para indicar que é um componente funcional do React, 
// e Props para tipar as props de navegação.
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // pega a função de salvar sessão do contexto de autenticação
  const { salvarSessao } = useAuth();

  // limpa o erro quando o usuário começa a digitar
  function limparErro() {
    if (erro) setErro("");
  }

  // responsável por validar o que foi digitado e enviar para o backend
  const handleCadastro = async () => {
    setErro("");

    // validação de campos obrigatórios
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    // validação de nome mínimo
    if (nome.trim().length < 3) {
      setErro("O nome deve ter no mínimo 3 caracteres.");
      return;
    }

    // validação de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())) {
      setErro("Informe um e-mail válido.");
      return;
    }

    // validação de senha mínima
    if (senha.trim().length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await cadastrarApi(
        nome.trim(),
        email.trim().toLowerCase(),
        senha.trim()
      );

      if (resposta.sucesso && resposta.dados) {
        // cadastro funcionou: salva a sessão e vai direto para o app
        salvarSessao(resposta.dados.token, resposta.dados.usuario);
        navigation.replace("Tabs");
      } else {
        setErro(resposta.mensagem || "Erro ao realizar cadastro.");
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    // KeyboardAvoidingView impede que o botão fique escondido atrás do teclado
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <ScrollView
      style={styles.fundo}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabeçalho igual ao login */}
      <View style={styles.cabecalho}>
        <View style={styles.iconeContainer}>
          <Ionicons name="heart" size={38} color={COLORS.textInverse} />
        </View>
        <Text style={styles.titulo}>BabyGuard</Text>
        <Text style={styles.subtitulo}>Monitoramento inteligente do seu bebê</Text>
      </View>

      {/* Formulário igual ao login */}
      <View style={styles.formulario}>
        <Text style={styles.tituloBemVindo}>Criar Conta</Text>
        <Text style={styles.instrucao}>Preencha os dados para se cadastrar</Text>

        {/* mensagem de erro */}
        {erro !== "" && (
          <View style={styles.caixaErro}>
            <Ionicons name="alert-circle-outline" size={16} color="#D9534F" />
            <Text style={styles.textoErro}>{erro}</Text>
          </View>
        )}

        {/* campo nome */}
        <View style={styles.grupoCampo}>
          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.campoComIcone}>
            <Ionicons
              name="person-outline"
              size={18}
              color={COLORS.textTertiary}
              style={styles.iconeInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor={COLORS.textTertiary}
              value={nome}
              onChangeText={(v) => { limparErro(); setNome(v); }}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
        </View>

        {/* campo email */}
        <View style={styles.grupoCampo}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.campoComIcone}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={COLORS.textTertiary}
              style={styles.iconeInput}
            />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={COLORS.textTertiary}
              value={email}
              onChangeText={(v) => { limparErro(); setEmail(v); }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* campo senha */}
        <View style={styles.grupoCampo}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.campoComIcone}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.textTertiary}
              style={styles.iconeInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={COLORS.textTertiary}
              value={senha}
              onChangeText={(v) => { limparErro(); setSenha(v); }}
              secureTextEntry={!senhaVisivel}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleCadastro}
            />
            <TouchableOpacity
              onPress={() => setSenhaVisivel((prev) => !prev)}
              style={styles.botaoOlho}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={senhaVisivel ? "eye-outline" : "eye-off-outline"}
                size={18}
                color={COLORS.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* botão cadastrar */}
        <TouchableOpacity
          style={[styles.botaoEntrar, carregando && styles.botaoDesativado]}
          onPress={handleCadastro}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <Text style={styles.textoBotaoEntrar}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* divisor */}
        <View style={styles.divisor}>
          <View style={styles.linhaDivisor} />
          <Text style={styles.textoDivisor}>ou</Text>
          <View style={styles.linhaDivisor} />
        </View>

        {/* link para login */}
        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Já tem uma conta? </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.textoCriarConta}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

// estilos idênticos ao LoginScreen
const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  cabecalho: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconeContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  formulario: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 24,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  tituloBemVindo: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  instrucao: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  caixaErro: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FACCCC",
  },
  textoErro: {
    flex: 1,
    fontSize: 13,
    color: "#D9534F",
  },
  grupoCampo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  campoComIcone: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  iconeInput: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 13,
  },
  botaoOlho: {
    padding: 4,
  },
  botaoEntrar: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 14,
  },
  botaoDesativado: {
    opacity: 0.65,
  },
  textoBotaoEntrar: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: "700",
  },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  textoDivisor: {
    marginHorizontal: 12,
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textoRodape: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  textoCriarConta: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
});

export default RegisterScreen;