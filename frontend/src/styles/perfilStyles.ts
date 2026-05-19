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

  avatarSection: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
  },

  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  actionText: {
    marginLeft: SPACING.md,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },

  deleteText: {
    marginLeft: SPACING.md,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.error,
  },
});