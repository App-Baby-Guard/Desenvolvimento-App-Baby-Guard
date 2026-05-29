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
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.size.lg,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textSecondary,
      marginTop: 4,
    },
    uuidText: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textTertiary,
      marginTop: SPACING.xs,
    },
    statusText: {
      fontSize: TYPOGRAPHY.size.md,
      color: C.textPrimary,
      marginTop: 4,
    },
    statusLabel: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textTertiary,
      marginTop: SPACING.lg,
    },
    divider: {
      height: 1,
      backgroundColor: C.border,
      marginVertical: SPACING.xxl,
    },
    buttonSecondary: {
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
    loadingText: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textTertiary,
      marginTop: SPACING.sm,
    },
  });
}
