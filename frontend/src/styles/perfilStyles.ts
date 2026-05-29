import { StyleSheet } from "react-native";
import {
  COLORS,
  DARK_COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../shared/styles/globalStyles";

export function getStyles(isDarkMode: boolean) {
  const C = isDarkMode ? DARK_COLORS : COLORS;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: C.background,
    },

    screen: {
      flex: 1,
      backgroundColor: C.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: SPACING.xs,
      minHeight: 64,
      backgroundColor: C.surface,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: C.textPrimary,
      textAlign: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 22,
    },

    avatarSection: {
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: SPACING.lg,
      marginTop: SPACING.xl,
      marginBottom: SPACING.xl,
      paddingVertical: SPACING.xxxl,
      paddingHorizontal: SPACING.lg,
      backgroundColor: C.cardBackground,
      borderRadius: BORDER_RADIUS.xl,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.medium,
    },

    avatar: {
      width: 112,
      height: 112,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 4,
      borderColor: isDarkMode ? C.border : COLORS.primaryLight,
      marginBottom: SPACING.md,
    },

    avatarPlaceholder: {
      width: 112,
      height: 112,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: C.surfaceSoft,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: isDarkMode ? C.border : COLORS.primaryLight,
      marginBottom: SPACING.md,
    },

    userName: {
      fontSize: TYPOGRAPHY.size.xl,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
      marginBottom: 2,
    },

    userEmail: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
    },

    sectionContainer: {
      marginHorizontal: SPACING.lg,
      marginBottom: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      overflow: "hidden",
      backgroundColor: C.cardBackground,
      borderWidth: 1,
      borderColor: C.border,
    },

    rowPaddingThemed: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: C.cardBackground,
    },

    rowBorderThemed: {
      borderBottomColor: C.border,
      borderBottomWidth: 1,
    },

    fieldLabel: {
      fontSize: TYPOGRAPHY.size.xs,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textTertiary,
      letterSpacing: 0.6,
      marginBottom: 2,
    },

    input: {
      flex: 1,
      height: 52,
      backgroundColor: C.inputBackground,
      borderWidth: 1,
      borderColor: C.inputBorder,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      fontSize: TYPOGRAPHY.size.md,
      color: C.textPrimary,
    },

    saveButton: {
      backgroundColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.lg,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      marginHorizontal: SPACING.lg,
      marginTop: SPACING.xl,
      marginBottom: SPACING.xl,
      ...SHADOWS.medium,
    },

    saveButtonText: {
      color: COLORS.textInverse,
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.bold,
      letterSpacing: 0.3,
    },

    actionCard: {
      marginHorizontal: SPACING.lg,
      marginTop: SPACING.sm,
      borderRadius: BORDER_RADIUS.lg,
      overflow: "hidden",
      backgroundColor: C.cardBackground,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.soft,
    },

    actionText: {
      marginLeft: SPACING.md,
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.medium,
      color: C.textPrimary,
    },

    deleteText: {
      marginLeft: SPACING.md,
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.medium,
      color: COLORS.error,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(15,23,42,0.6)",
      justifyContent: "center",
      paddingHorizontal: SPACING.xl,
    },

    modalContainer: {
      backgroundColor: C.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xl,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.medium,
    },

    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },

    modalIcon: {
      width: 42,
      height: 42,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: C.surfaceSoft,
      alignItems: "center",
      justifyContent: "center",
      marginRight: SPACING.md,
    },

    modalTitle: {
      fontSize: TYPOGRAPHY.size.lg,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
    },

    modalDescription: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
      lineHeight: 20,
      marginBottom: SPACING.lg,
    },

    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: SPACING.sm,
    },

    cancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: C.surfaceSoft,
      marginRight: SPACING.sm,
    },

    cancelButtonText: {
      color: C.textSecondary,
      fontWeight: TYPOGRAPHY.weight.semiBold,
    },

    confirmButton: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.primary,
    },

    confirmButtonText: {
      color: COLORS.textInverse,
      fontWeight: TYPOGRAPHY.weight.bold,
    },

    footer: {
      textAlign: "center",
      marginTop: SPACING.xxl,
      fontSize: TYPOGRAPHY.size.xs,
      color: C.textTertiary,
    },

    iconWrapBg: {
      backgroundColor: C.surfaceSoft,
    },

    iconColor: {
      color: C.textTertiary,
    },

    infoRowBg: {
      backgroundColor: C.cardBackground,
      borderBottomColor: C.border,
    },

    infoRowLabel: {
      fontSize: TYPOGRAPHY.size.xs,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textTertiary,
      letterSpacing: 0.6,
      marginBottom: 2,
    },

    infoRowValue: {
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.medium,
      color: C.textPrimary,
    },

    actionRowBorder: {
      borderBottomColor: C.border,
    },
  });
}