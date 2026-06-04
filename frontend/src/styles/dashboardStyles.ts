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
    safeArea: {
      flex: 1,
      backgroundColor: C.background,
    },
    container: {
      flex: 1,
      backgroundColor: C.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      minHeight: 64,
      backgroundColor: C.background,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    title: {
      fontSize: TYPOGRAPHY.size.xxl,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
    },
    statusTitle: {
      fontSize: TYPOGRAPHY.size.xl,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.size.lg,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textSecondary,
    },
    textMuted: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textTertiary,
    },
    sectionTitle: {
      fontSize: TYPOGRAPHY.size.xs,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textTertiary,
      letterSpacing: 0.8,
    },
    card: {
      backgroundColor: C.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: C.border,
      marginBottom: SPACING.md,
      ...SHADOWS.soft,
    },
    btnSec: {
      backgroundColor: C.buttonSecondary,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      borderRadius: BORDER_RADIUS.md,
      alignItems: "center",
      justifyContent: "center",
    },
    btnSecText: {
      color: C.primaryDark,
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.semiBold,
    },

    headerAvatar: {
      width:50,
      height: 50,
      borderRadius: 16,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: isDarkMode ? C.border : COLORS.primaryLight,
    },

    avatarBorder: {
      borderWidth: 3,
      borderColor: COLORS.primary,
      borderRadius: 999,
      padding: 3,
    },

    userEmail: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
    },

    noDataContainer: {
      marginTop: SPACING.md,
      alignItems: "center",
    },

    footerSpacing: {
      height: SPACING.xl,
    },
  });
}
