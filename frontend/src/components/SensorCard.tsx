import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  contentWrapper: {
    marginBottom: 12,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default SensorCard;