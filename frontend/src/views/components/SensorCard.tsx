import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../shared/styles/globalStyles';

interface SensorCardProps {
  //icones
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  status: string;
  statusColor?: string;
  iconColor?: string;
}

const SensorCard: React.FC<SensorCardProps> = ({
  iconName,
  label,
  value,
  status,
  statusColor = '#4CAF50', 
  iconColor = '#0066FF',  
}) => {
  return (
    <View style={styles.cardContainer}>
      
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={32} color={iconColor} />
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { 
              width: '75%', // Valor fixo simulando
              backgroundColor: statusColor 
            },
          ]}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%', 
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  contentWrapper: {
    marginBottom: SPACING.md,
  },
  valueText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  labelText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    color: COLORS.textInverse,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
});

export default SensorCard;