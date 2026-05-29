import { StyleSheet } from "react-native";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../shared/styles/globalStyles";

export function getStyles() {

  return StyleSheet.create({
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
}