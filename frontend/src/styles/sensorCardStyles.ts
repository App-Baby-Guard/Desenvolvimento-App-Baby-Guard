import { StyleSheet } from "react-native";
import {
  COLORS,
  DARK_COLORS,
  SPACING,
  BORDER_RADIUS,
} from "../shared/styles/globalStyles";

export function getStyles(isDarkMode: boolean) {
  const C = isDarkMode ? DARK_COLORS : COLORS;

  return StyleSheet.create({
    cardContainer: {
      width: "48%",
      marginVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.lg,
      backgroundColor: C.cardBackground,
      borderRadius: BORDER_RADIUS.md,
      shadowColor: C.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconContainer: {
      marginBottom: SPACING.md,
      alignItems: "flex-start",
    },
    contentWrapper: {
      marginBottom: SPACING.md,
    },
    valueText: {
      fontSize: 18,
      fontWeight: "bold",
      color: C.textPrimary,
      marginBottom: SPACING.xs,
    },
    labelText: {
      fontSize: 14,
      color: C.textSecondary,
      fontWeight: "500",
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.full,
      marginBottom: SPACING.md,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: COLORS.textInverse,
    },
    progressBarBackground: {
      width: "100%",
      height: 4,
      backgroundColor: C.border,
      borderRadius: BORDER_RADIUS.sm,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: BORDER_RADIUS.sm,
    },
  });
}
