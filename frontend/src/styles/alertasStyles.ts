import { StyleSheet } from "react-native";
import {
  COLORS,
  DARK_COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
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
    filterContainer: {
      flexDirection: "row",
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: C.surface,
      gap: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    filterButton: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: C.surfaceSoft,
    },
    filterButtonActive: {
      backgroundColor: COLORS.primary,
    },
    filterText: {
      fontSize: TYPOGRAPHY.size.sm,
      fontWeight: TYPOGRAPHY.weight.semiBold,
      color: C.textSecondary,
    },
    filterTextActive: {
      color: COLORS.textInverse,
    },
    list: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      backgroundColor: C.background,
    },
    secaoLabel: {
      fontSize: TYPOGRAPHY.size.xs,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textTertiary,
      letterSpacing: 1,
      marginTop: SPACING.md,
      marginBottom: SPACING.sm,
    },
    eventCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: C.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      overflow: "hidden",
      shadowColor: C.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    eventCardUnresolved: {
      borderWidth: 1,
      borderColor: COLORS.error,
    },
    eventTitle: {
      flex: 1,
      fontSize: TYPOGRAPHY.size.md,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
      marginRight: SPACING.sm,
    },
    eventTitleRead: {
      fontWeight: TYPOGRAPHY.weight.medium,
      color: C.textSecondary,
    },
    eventTime: {
      fontSize: TYPOGRAPHY.size.xs,
      color: C.textTertiary,
      marginTop: 2,
    },
    eventDescription: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
      lineHeight: 18,
    },
    eventDescriptionRead: {
      color: C.textTertiary,
    },
    emptyStateTitle: {
      fontSize: TYPOGRAPHY.size.xl,
      fontWeight: TYPOGRAPHY.weight.bold,
      color: C.textPrimary,
      marginTop: SPACING.md,
    },
    emptyStateSubtitle: {
      fontSize: TYPOGRAPHY.size.sm,
      color: C.textSecondary,
      marginTop: SPACING.xs,
      textAlign: "center",
    },
    iconColor: {
      color: C.textSecondary,
    },
  });
}
