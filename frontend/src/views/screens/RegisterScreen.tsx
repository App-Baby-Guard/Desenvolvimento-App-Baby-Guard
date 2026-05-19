import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../routes/RootNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleCadastro = async () => {
    setErro("");

    // Validação de campos obrigatórios
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    // Validação de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())) {
      setErro("Informe um e-mail válido.");
      return;
    }

    // Validação de senha mínima
    if (senha.trim().length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome.trim(),
          email: email.trim().toLowerCase(),
          password: senha.trim(),
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok || dados.sucesso) {
        Alert.alert("Sucesso", "Cadastro realizado! Faça login para continuar.", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        setErro(dados.mensagem || dados.message || "Erro ao realizar cadastro.");
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.titulo}>Criar Conta</Text>

          {/* ERRO */}
          {erro !== "" && (
            <View style={styles.caixaErro}>
              <Ionicons name="alert-circle-outline" size={16} color="#D9534F" />
              <Text style={styles.textoErro}>{erro}</Text>
            </View>
          )}

          {/* NOME */}
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={(v) => { setErro(""); setNome(v); }}
            autoCapitalize="words"
            returnKeyType="next"
          />

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={(v) => { setErro(""); setEmail(v); }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
          />

          {/* SENHA */}
          <View style={styles.campoSenha}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Senha (mínimo 6 caracteres)"
              value={senha}
              onChangeText={(v) => { setErro(""); setSenha(v); }}
              secureTextEntry={!senhaVisivel}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleCadastro}
            />
            <TouchableOpacity
              onPress={() => setSenhaVisivel((prev) => !prev)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={senhaVisivel ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* BOTÃO */}
          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesativado]}
            activeOpacity={0.8}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotao}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          {/* VOLTAR PARA LOGIN */}
          <View style={styles.rodape}>
            <Text style={styles.textoRodape}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.textoLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },

  container: {
    width: "100%",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#111111",
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

  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
  },

  campoSenha: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#F8F8F8",
  },

  inputSenha: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },

  botao: {
    backgroundColor: "#0066FF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  botaoDesativado: {
    opacity: 0.65,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  textoRodape: {
    fontSize: 13,
    color: "#555555",
  },

  textoLink: {
    fontSize: 13,
    color: "#0066FF",
    fontWeight: "700",
  },
});
export default RegisterScreen;