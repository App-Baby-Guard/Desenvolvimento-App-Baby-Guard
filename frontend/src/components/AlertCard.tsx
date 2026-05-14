// src/components/AlertCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Interface para as props do alerta
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
  // Container principal do alerta
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevação Android
    elevation: 2,
  },

  // Wrapper do ícone
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  // Wrapper do conteúdo de texto
  contentWrapper: {
    flex: 1,
  },

  // Título do alerta
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },

  // Descrição do alerta
  descriptionText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 6,
    lineHeight: 16,
  },

  // Hora do alerta
  timeText: {
    fontSize: 11,
    color: '#BBBBBB',
    fontWeight: '500',
  },

  // Botão de fechar
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default AlertCard;