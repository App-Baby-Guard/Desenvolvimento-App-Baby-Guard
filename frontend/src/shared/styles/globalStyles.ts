import { StyleSheet } from "react-native";

// CORES PRINCIPAIS
export const COLORS = {
  primary: "#7EC8F8",
  primaryDark: "#5AB6F3",
  primaryLight: "#BFE7FF",
  secondary: "#A8D8FF",
  secondaryLight: "#D9F0FF",
  background: "#F5FBFF",
  surface: "#FFFFFF",
  surfaceSoft: "#EEF8FF",
  textPrimary: "#1F2D3D",
  textSecondary: "#5C6B7A",
  textTertiary: "#8FA1B3",
  textInverse: "#FFFFFF",
  success: "#7ED6A7",
  warning: "#eebc5e",
  error: "#FF9EAA",
  info: "#8ED1FC",
  border: "#D6EAF8",
  borderStrong: "#B7D7EE",
  shadowColor: "rgba(126, 200, 248, 0.18)",
  buttonPrimary: "#7EC8F8",
  buttonPrimaryPressed: "#5AB6F3",
  buttonSecondary: "#E4F5FF",
  buttonSecondaryPressed: "#D4EEFF",
  inputBackground: "#FFFFFF",
  inputBorder: "#D6EAF8",
  inputFocus: "#7EC8F8",
  cardBackground: "#FFFFFF",
};

// TIPOGRAFIA
export const TYPOGRAPHY = {
  size: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 28, display: 36 },
  line: { sm: 16, md: 20, lg: 24, xl: 30 },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },
};

// ESPAÇAMENTO
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

// BORDAS
export const BORDER_RADIUS = { sm: 8, md: 12, lg: 18, xl: 24, full: 999 };

// SOMBREADOS
export const SHADOWS = {
  soft: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
};

// ESTILOS GLOBAIS
export const GLOBAL_STYLES = StyleSheet.create({
  // LAYOUT
  screen: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: SPACING.lg,
  },
  scrollContent: { flexGrow: 1, paddingBottom: SPACING.xxxl },
  centerContent: { justifyContent: "center", alignItems: "center" },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.xs,
    minHeight: 64,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: SPACING.md, marginRight: SPACING.sm },

  // TEXTO
  title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.textSecondary,
  },
  text: {
    fontSize: TYPOGRAPHY.size.md,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.line.md,
  },
  textMuted: { fontSize: TYPOGRAPHY.size.sm, color: COLORS.textTertiary },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.textTertiary,
    letterSpacing: 0.8,
  },
  sectionAction: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.primaryDark,
  },

  // CARD
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  cardNoPadding: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOWS.soft,
  },

  // ROW/LIST
  row: { flexDirection: "row", alignItems: "center" },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPadding: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  rowBorder: { borderBottomColor: COLORS.border },
  rowLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textPrimary,
  },

  // AVATAR/ICONE
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  // BOTOES
  buttonPrimary: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.soft,
  },
  buttonPrimaryText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  buttonSecondary: {
    backgroundColor: COLORS.buttonSecondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondaryText: {
    color: COLORS.primaryDark,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semiBold,
  },

  // INPUT
  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.size.md,
    color: COLORS.textPrimary,
  },

  // BADGES
  badge: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  badgeSuccess: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeSuccessText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textInverse,
    letterSpacing: 0.5,
  },

  // DEVICE FIELDS
  deviceField: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.textTertiary,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textPrimary,
  },

  rangeText: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.textPrimary,
  },

  // UTIL
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  footer: {
    textAlign: "center",
    marginTop: SPACING.xxl,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textTertiary,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.error,
  },

  flex1: { flex: 1 },

  // FILTROS/TABS
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceSoft,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.textInverse,
  },

  // LISTA/SCROLL
  list: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  // EVENTOS/ALERTAS CARD
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  eventCardUnresolved: {
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  lateralBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: SPACING.md,
    marginRight: SPACING.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  eventTitleRead: {
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textSecondary,
  },
  eventTime: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  eventDescription: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  eventDescriptionRead: {
    color: COLORS.textTertiary,
  },

  // BADGES
  badgeUnresolved: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEBEE',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: SPACING.xs,
  },
  badgeUnresolvedText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semiBold,
    color: '#E53935',
  },

  // EMPTY STATES
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // SEÇÃO LABELS
  secaoLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textTertiary,
    letterSpacing: 1,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
});
