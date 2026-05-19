import { StyleSheet } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../shared/styles/globalStyles";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

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

    headerButton: {
        fontSize: TYPOGRAPHY.size.md,
        fontWeight: TYPOGRAPHY.weight.bold,
        color: COLORS.primary,
    },

    // ========== filtros ==========
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        gap: SPACING.sm,
    },

    tabButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceSoft,
    },

    // filtro ativa
    tabButtonActive: {
        backgroundColor: COLORS.primary,
    },

    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },

    tabTextActive: {
        color: COLORS.textInverse,
    },

    // ========== LISTA DE ALERTAS ==========
    alertsList: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },

      title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },

    // ========== ESTADO VAZIO ==========
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },

    emptyStateText: {
        fontSize: TYPOGRAPHY.size.lg,
        fontWeight: TYPOGRAPHY.weight.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING.md,
    },

    emptyStateSubtext: {
        fontSize: TYPOGRAPHY.size.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },

    bottomSpacer: {
        height: SPACING.lg,
    },
});

export default styles;