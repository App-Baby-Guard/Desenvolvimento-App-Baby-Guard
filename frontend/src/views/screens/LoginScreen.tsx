import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../shared/styles/globalStyles'; // ✅ CORRIGIDO: era '../../styles/globalStyles'
import { useLogin } from '../../hooks/useLogin';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const {
    form,
    senhaVisivel,
    carregando,
    erro,
    setEmail,
    setSenha,
    toggleSenhaVisivel,
    handleLogin
  } = useLogin((token) => {
    console.log("Token recebido:", token);
    navigation.navigate("Main");
  });

  return (
    <ScrollView
      style={styles.fundo}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.cabecalho}>
        <View style={styles.iconeContainer}>
          <Ionicons
            name="heart"
            size={38}
            color={COLORS.textInverse}
          />
        </View>

        <Text style={styles.titulo}>
          BabyGuard
        </Text>

        <Text style={styles.subtitulo}>
          Monitoramento inteligente do seu bebê
        </Text>
      </View>

      <View style={styles.formulario}>
        <Text style={styles.tituloBemVindo}>
          Bem-vindo de volta
        </Text>

        <Text style={styles.instrucao}>
          Faça login para continuar
        </Text>

        {erro !== '' && (
          <View style={styles.caixaErro}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color="#D9534F"
            />

            <Text style={styles.textoErro}>
              {erro}
            </Text>
          </View>
        )}

        {/* EMAIL */}
        <View style={styles.grupoCampo}>
          <Text style={styles.label}>
            E-mail
          </Text>

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
              value={form.email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* SENHA */}
        <View style={styles.grupoCampo}>
          <Text style={styles.label}>
            Senha
          </Text>

          <View style={styles.campoComIcone}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.textTertiary}
              style={styles.iconeInput}
            />

            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor={COLORS.textTertiary}
              value={form.senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVisivel}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              onPress={toggleSenhaVisivel}
              style={styles.botaoOlho}
              hitSlop={{
                top: 8,
                bottom: 8,
                left: 8,
                right: 8
              }}
            >
              <Ionicons
                name={
                  senhaVisivel
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={18}
                color={COLORS.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTÃO LOGIN */}
        <TouchableOpacity
          style={[
            styles.botaoEntrar,
            carregando && styles.botaoDesativado
          ]}
          onPress={handleLogin}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator
              color={COLORS.textInverse}
            />
          ) : (
            <Text style={styles.textoBotaoEntrar}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        {/* ESQUECEU SENHA */}
        <TouchableOpacity style={styles.linkEsqueceuSenha}>
          <Text style={styles.textoLink}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        {/* DIVISOR */}
        <View style={styles.divisor}>
          <View style={styles.linhaDivisor} />

          <Text style={styles.textoDivisor}>
            ou
          </Text>

          <View style={styles.linhaDivisor} />
        </View>

        {/* CADASTRAR */}
        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>
            Não tem uma conta?{" "}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.textoCriarConta}>
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
    shadowOffset: {
      width: 0,
      height: 4
    },
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

  linkEsqueceuSenha: {
    alignItems: "center",
    marginBottom: 20,
  },

  textoLink: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: "600",
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

export default LoginScreen;