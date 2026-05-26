import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../shared/styles/globalStyles";

export const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },

  sensorRow: {
    backgroundColor: COLORS.surface,
  },

  accountRow: {
    minHeight: 88,
    backgroundColor: COLORS.surface,
  },

  accountAvatar: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },

  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },

  userName: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  userEmail: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },

  logoutRow: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    backgroundColor: "#FFF7F8",
  },

  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.error,
  },

  activeBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },

  activeBadgeText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    letterSpacing: 0.6,
  },

  fieldValueDisp: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.textPrimary,
  },

  sensorRange: {
    backgroundColor: COLORS.surfaceSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },

  sensorRangeText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },

  toggleContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  toggleLabel: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textPrimary,
  },

  toggleDescription: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.surfaceSoft,
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
    backgroundColor: COLORS.success,
    marginRight: 6,
  },

  statusText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },

  footerSpacing: {
    height: SPACING.xxxl,
  },
});