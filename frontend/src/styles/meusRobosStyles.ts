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
    searchInput: {
      backgroundColor: C.inputBackground,
      borderWidth: 1,
      borderColor: C.inputBorder,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: TYPOGRAPHY.size.md,
      color: C.textPrimary,
      marginTop: SPACING.lg,
    },
    list: {
      flex: 1,
      backgroundColor: C.background,
    },
    listContent: {
      padding: SPACING.lg,
      backgroundColor: C.background,
    },
    card: {
      backgroundColor: C.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.soft,
    },
    cardName: {
      fontSize: TYPOGRAPHY.size.lg,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textPrimary,
    },
    cardUuid: {
      fontSize: TYPOGRAPHY.size.xs,
      color: C.textTertiary,
      marginTop: 2,
    },
    addCard: {
      backgroundColor: C.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.soft,
    },
    addCardTitle: {
      fontSize: TYPOGRAPHY.size.lg,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textPrimary,
    },
    addCardSubtitle: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textTertiary,
    },
    actionBtnEdit: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: C.buttonSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    actionBtnDelete: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: C.surfaceSoft,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textTertiary,
      marginTop: SPACING.sm,
    },
  });
}
