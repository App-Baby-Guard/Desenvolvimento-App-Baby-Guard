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
    cardContainer: {
      width: "48%",
      marginVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.lg,
      backgroundColor: C.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      ...SHADOWS.soft,
      shadowColor: isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.34)",
      shadowOpacity: isDarkMode ? 0.4 : 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    iconContainer: {
      marginBottom: SPACING.md,
      alignItems: "flex-start",
    },
    contentWrapper: {
      marginBottom: SPACING.md,
    },
    valueText: {
      fontSize: TYPOGRAPHY.size.lg,
      fontWeight: "bold",
      color: C.textPrimary,
      marginBottom: SPACING.xs,
    },
    labelText: {
      fontSize: TYPOGRAPHY.size.sm,
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
      fontSize: TYPOGRAPHY.size.xs,
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
