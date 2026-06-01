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

    sectionCard: {
      marginHorizontal: SPACING.lg,
      marginBottom: SPACING.lg,
      borderRadius: BORDER_RADIUS.xl,
      overflow: "hidden",
      backgroundColor: C.cardBackground,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.soft,
    },

    sensorRow: {
      backgroundColor: C.cardBackground,
    },

    accountRow: {
      minHeight: 88,
      backgroundColor: C.cardBackground,
    },

    accountAvatar: {
      width: 56,
      height: 56,
      borderRadius: BORDER_RADIUS.full,
      marginRight: SPACING.md,
      borderWidth: 3,
      borderColor: C.primaryLight,
    },

    avatarPlaceholder: {
      width: 56,
      height: 56,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: C.surfaceSoft,
      alignItems: "center",
      justifyContent: "center",
      marginRight: SPACING.md,
      borderWidth: 3,
      borderColor: isDarkMode ? C.border : COLORS.primaryLight,
    },

    userName: {
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
      marginBottom: 2,
    },

    userEmail: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
    },

    logoutRow: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: SPACING.lg,
      backgroundColor: isDarkMode ? "#1f1215" : "#FFF7F8",
    },

    logoutContent: {
      flexDirection: "row",
      alignItems: "center",
    },

    logoutText: {
      marginLeft: SPACING.sm,
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.error,
    },

    activeBadge: {
      backgroundColor: C.success,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: BORDER_RADIUS.full,
    },

    activeBadgeText: {
      color: C.textInverse,
      fontSize: TYPOGRAPHY.size.xs,
      fontWeight: TYPOGRAPHY.weight.bold,
      letterSpacing: 0.6,
    },

    fieldValueDisp: {
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textPrimary,
    },

    sensorRange: {
      backgroundColor: C.surfaceSoft,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.full,
    },

    sensorRangeText: {
      fontSize: TYPOGRAPHY.size.sm,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
    },

    toggleContent: {
      flex: 1,
      marginLeft: SPACING.md,
    },

    toggleLabel: {
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.medium,
      color: C.textPrimary,
    },

    toggleDescription: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
      marginTop: 2,
    },

    firmwareRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    refreshButton: {
      width: 34,
      height: 34,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: C.surfaceSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    deviceStatus: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: SPACING.xs,
    },

    statusDot: {
      width: 8,
      height: 8,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: C.success,
      marginRight: 6,
    },

    statusText: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
    },

    footerSpacing: {
      height: SPACING.xxxl,
    },

    screen: {
      flex: 1,
      backgroundColor: C.background,
    },

    safeArea: {
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

    rowWithBorder: {
      borderBottomColor: C.border,
    },

    cardWithTheme: {
      backgroundColor: C.cardBackground,
      borderColor: C.border,
    },

    fieldLabelThemed: {
      fontSize: TYPOGRAPHY.size.xs,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textTertiary,
      letterSpacing: 0.6,
      marginBottom: 2,
    },

    fieldValueThemed: {
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.medium,
      color: C.textPrimary,
    },

    footerThemed: {
      textAlign: "center",
      marginTop: SPACING.xxl,
      fontSize: TYPOGRAPHY.size.xs,
      color: C.textTertiary,
    },

    iconColor: {
      color: C.textTertiary,
    },

    titleThemed: {
      fontSize: 28,
      fontWeight: "700",
      color: C.textPrimary,
      textAlign: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 22,
    },

    deviceFieldBorder: {
      borderBottomColor: C.border,
    },

    rowBackground: {
      backgroundColor: C.cardBackground,
      borderBottomColor: C.border,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalContainer: {
      width: "85%",
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
      backgroundColor: C.cardBackground,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.soft,
    },

    modalTitle: {
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
      marginBottom: SPACING.lg,
      textAlign: "center",
    },

    modalInputSection: {
      marginBottom: SPACING.md,
    },

    modalInputSectionTitle: {
      fontSize: TYPOGRAPHY.size.sm,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: isDarkMode ? COLORS.primaryLight : COLORS.primary,
      marginBottom: 6,
    },

    modalRowInputContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    modalInputGroup: {
      flex: 1,
    },

    modalInputLabel: {
      color: C.textSecondary,
      fontSize: TYPOGRAPHY.size.xs,
    },

    modalTextInput: {
      borderWidth: 1,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      marginTop: 4,
      fontSize: TYPOGRAPHY.size.md,
      textAlign: "center",
      color: C.textPrimary,
      borderColor: C.border,
      backgroundColor: C.surface,
    },

    modalActionButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: SPACING.md,
    },

    modalBtnCancel: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: BORDER_RADIUS.md,
      alignItems: "center",
      marginHorizontal: 5,
      backgroundColor: isDarkMode ? "#3A3A3C" : "#E5E5EA",
    },

    modalBtnSave: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: BORDER_RADIUS.md,
      alignItems: "center",
      marginHorizontal: 5,
      backgroundColor: isDarkMode ? COLORS.primary : COLORS.primary,
    },

    modalBtnTextCancel: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
      fontWeight: TYPOGRAPHY.weight.semiBold,
    },

    modalBtnTextSave: {
      color: "#FFFFFF",
      fontWeight: TYPOGRAPHY.weight.semiBold,
    },
  });
}