import { StyleSheet } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS } from "../shared/styles/globalStyles";

export const styles = StyleSheet.create({

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 25,
    bottom: 0,
    textAlignVertical: "center",
  },

  sensorRow: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },

  accountRow: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },

  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
  },

  logoutRow: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    justifyContent: "center",
    alignItems: "center",
  },

  activeBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 12,
    height: 12,
  },

  activeBadgeText: {
    color: COLORS.surface,
    fontSize: 8,
    fontWeight: "bold",
  },

  fieldValueDisp: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surfaceSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },

});
