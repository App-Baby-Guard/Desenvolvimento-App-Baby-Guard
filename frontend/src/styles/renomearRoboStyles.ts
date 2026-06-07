import { StyleSheet } from "react-native";
import {
  COLORS,
  DARK_COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../shared/styles/globalStyles";

export function getStyles(isDarkMode: boolean) {
  const C = isDarkMode ? DARK_COLORS : COLORS;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: C.background,
    },
    container: {
      padding: SPACING.lg,
      backgroundColor: C.background,
    },
    backRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },
    backText: {
      marginLeft: SPACING.sm,
      fontSize: TYPOGRAPHY.size.md,
      color: C.textPrimary,
    },
    title: {
      fontSize: TYPOGRAPHY.size.xxl,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
      marginBottom: SPACING.lg,
    },
    label: {
      fontSize: TYPOGRAPHY.size.sm,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textTertiary,
      letterSpacing: 0.6,
      marginTop: SPACING.lg,
      marginBottom: SPACING.xs,
    },
    input: {
      backgroundColor: C.inputBackground,
      borderWidth: 1,
      borderColor: C.inputBorder,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textPrimary,
    },
    actionsRow: {
      flexDirection: "row",
      marginTop: SPACING.xxl,
      gap: SPACING.lg,
    },
    buttonSecondary: {
      flex: 1,
      backgroundColor: C.buttonSecondary,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      borderRadius: BORDER_RADIUS.md,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSecondaryText: {
      color: C.primaryDark,
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.semiBold,
    },
    uuid: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textTertiary,
      marginTop: SPACING.sm,
    },
  });
}
