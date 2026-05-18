import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#7EC8F8",
  primaryDark: "#5AB6F3",
  primaryLight: "#BFE7FF",

  secondary: "#A8D8FF",
  secondaryLight: "#D9F0FF",

  background: "#F5FBFF",
  surface: "#FFFFFF",
  surfaceSoft: "#EEF8FF",

  textPrimary: "#1F2D3D",
  textSecondary: "#5C6B7A",
  textTertiary: "#8FA1B3",
  textInverse: "#FFFFFF",

  success: "#7ED6A7",
  warning: "#eebc5e",
  error: "#FF9EAA",
  info: "#8ED1FC",

  border: "#D6EAF8",
  borderStrong: "#B7D7EE",

  shadowColor: "rgba(126, 200, 248, 0.18)",

  buttonPrimary: "#7EC8F8",
  buttonPrimaryPressed: "#5AB6F3",
  buttonSecondary: "#E4F5FF",
  buttonSecondaryPressed: "#D4EEFF",

  inputBackground: "#FFFFFF",
  inputBorder: "#D6EAF8",
  inputFocus: "#7EC8F8",

  cardBackground: "#FFFFFF",
};

export const TYPOGRAPHY = {
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 28,
    display: 36,
  },

  lineHeight: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 30,
  },

  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
};

export const SHADOWS = {
  soft: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },

  medium: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const GLOBAL_STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    padding: SPACING.lg,
  },

  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },

  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.textSecondary,
  },

  text: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },

  textMuted: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
  },

  buttonPrimary: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.soft,
  },

  buttonPrimaryText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },

  buttonSecondary: {
    backgroundColor: COLORS.buttonSecondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonSecondaryText: {
    color: COLORS.primaryDark,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },

  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },

  badge: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
});

/*
COLOCAR AO INÍCIO DO ARQUIVO PARA FACILITAR A IMPORTAÇÃO EM OUTROS COMPONENTES 
import { StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from "./globalStyles";
*/
