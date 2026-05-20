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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL_STYLES, SPACING } from '../../shared/styles/globalStyles'; 
import { useLogin } from '../../hooks/useLogin';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../routes/RootNavigator";

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
    navigation.navigate("Tabs");
  });

  return (
    <SafeAreaView style={GLOBAL_STYLES.screen}>
      <ScrollView
        contentContainerStyle={[GLOBAL_STYLES.scrollContent, styles.scrollCenter]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={GLOBAL_STYLES.container}>
          <View style={styles.cabecalho}>
            <View style={styles.iconeContainer}>
              <Ionicons
                name="heart"
                size={38}
                color={COLORS.textInverse}
              />
            </View>

            <Text style={GLOBAL_STYLES.title}>
              BabyGuard
            </Text>

            <Text style={GLOBAL_STYLES.textMuted}>
              Monitoramento inteligente do seu bebê
            </Text>
          </View>

          <View style={GLOBAL_STYLES.card}>
            <Text style={GLOBAL_STYLES.subtitle}>
              Bem-vindo de volta
            </Text>

            <Text style={[GLOBAL_STYLES.textMuted, { marginBottom: SPACING.xl }]}>
              Faça login para continuar
            </Text>

            {erro !== '' && (
              <View style={styles.caixaErro}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORS.error}
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
                  style={styles.inputFlex}
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
                  style={styles.inputFlex}
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
                GLOBAL_STYLES.buttonPrimary,
                { marginTop: SPACING.sm, marginBottom: SPACING.md },
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
                <Text style={GLOBAL_STYLES.buttonPrimaryText}>
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
              <View style={[GLOBAL_STYLES.divider, { flex: 1 }]} />

              <Text style={styles.textoDivisor}>
                ou
              </Text>

              <View style={[GLOBAL_STYLES.divider, { flex: 1 }]} />
            </View>

            {/* CADASTRAR */}
            <View style={[GLOBAL_STYLES.row, { justifyContent: 'center' }]}>
              <Text style={GLOBAL_STYLES.textMuted}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollCenter: {
    justifyContent: "center",
  },

  cabecalho: {
    alignItems: "center",
    marginBottom: SPACING.xxxl,
    marginTop: SPACING.xl,
  },

  iconeContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  caixaErro: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: "#FACCCC",
  },

  textoErro: {
    flex: 1,
    fontSize: 13,
    color: COLORS.error,
  },

  grupoCampo: {
    marginBottom: SPACING.lg,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  campoComIcone: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
  },

  iconeInput: {
    marginRight: SPACING.sm,
  },

  inputFlex: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 13,
  },

  botaoOlho: {
    padding: 4,
  },

  botaoDesativado: {
    opacity: 0.65,
  },

  linkEsqueceuSenha: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  textoLink: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: "600",
  },

  divisor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  textoDivisor: {
    marginHorizontal: SPACING.md,
    fontSize: 12,
    color: COLORS.textTertiary,
  },

  textoCriarConta: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
});

export default LoginScreen;