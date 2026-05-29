import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from '../../styles/sensorCardStyles';

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
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

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
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>

    </View>
  );
};

export default SensorCard;