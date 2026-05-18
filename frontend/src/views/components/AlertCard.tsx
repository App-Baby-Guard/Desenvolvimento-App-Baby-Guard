import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../shared/styles/globalStyles';

interface AlertCardProps {
  iconName: string;        // Nome do ícone Ionicons
  iconColor: string;       // Cor do ícone (ex: "#FF6B6B")
  title: string;           // Título do alerta (ex: "Temperatura alta")
  description: string;     // Descrição do alerta
  time: string;            // Hora (ex: "14:30")
  onDismiss: () => void;   // Função para remover alerta
}

const AlertCard: React.FC<AlertCardProps> = ({
  iconName,
  iconColor,
  title,
  description,
  time,
  onDismiss,
}) => {
  return (
    <View style={styles.alertContainer}>
      {/* Ícone esquerdo do alerta */}
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName as any} size={28} color={iconColor} />
      </View>

      {/* Conteúdo do alerta (título, descrição, hora) */}
      <View style={styles.contentWrapper}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      {/* Botão de fechar alerta */}
      <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
        <Ionicons name="close-circle" size={24} color="#CCCCCC" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  contentWrapper: {
    flex: 1,
  },

  titleText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  descriptionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 16,
  },

  timeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },

  closeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.md,
  },
});

export default AlertCard;