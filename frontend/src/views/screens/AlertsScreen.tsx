import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AlertCard from '../components/AlertCard';
import styles from '../../styles/alertStyles';
import { COLORS, SPACING, BORDER_RADIUS, GLOBAL_STYLES, TYPOGRAPHY } from '../../shared/styles/globalStyles';

const AlertsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [alerts, setAlerts] = useState([
        // Exemplo de dados de alerta
        //TODO: Substituir os alertas fixos pelos recebidos da API
        {
            id: 1,
            iconName: 'thermometer' as const,
            //'as const' é usado para garantir que o tipo seja exatamente 'thermometer', o valor não muda- 'thermometer' faz parte da lista oficial de ícones permitidos do Ionicons
            iconColor: '#FF6B6B',
            title: 'Temperatura alta',
            description: 'Sensor detectou 29°C na quarta',
            time: '14:30',
        },
        {
            id: 2,
            iconName: 'walk' as const,
            iconColor: '#4ECDC4',
            title: 'Movimento detectado',
            description: 'Atividade identificada à 12h ago',
            time: '12:15',
        },
        {
            id: 3,
            iconName: 'water-outline' as const,
            iconColor: '#4ECDC4',
            title: 'Umidade baixa',
            description: 'Umidade está em 30% - Recomenda-se ligar humidificador',
            time: '10:45',
        },
        {
            id: 4,
            iconName: 'volume-high' as const,
            iconColor: '#FFB347',
            title: 'Choro detectado',
            description: 'Áudio acima do limite para alertar o cuidador',
            time: '10:15',
        },
        {
            id: 5,
            iconName: 'moon' as const,
            iconColor: '#A78BFA',
            title: 'Modo Noturno ativado',
            description: 'O monitoramento de luz foi reduzido',
            time: '07:10',
        },
        {
            id: 6,
            iconName: 'wifi-outline' as const,
            iconColor: '#66BB6A',
            title: 'Conexão restaurada',
            description: 'A câmera reconectou com sucesso à rede',
            time: '07:15',
        },
    ]);

    const [activeTab, setActiveTab] = useState('Todas');

    // Função para remover alerta
    const handleDismissAlert = (alertId: number) => {
        setAlerts(alerts.filter((alert) => alert.id !== alertId));
    };

    // Função para limpar todos os alertas
    const handleClearAll = () => {
        setAlerts([]);
    };

    return (    
 <View style={styles.container}>
  <SafeAreaView style={GLOBAL_STYLES.safeArea}>
    <View style={GLOBAL_STYLES.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={GLOBAL_STYLES.backBtn}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>

      <View style={GLOBAL_STYLES.header}>
        <Text style={[GLOBAL_STYLES.title, styles.headerTitle]}>
          Alertas
        </Text>

        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.headerButton}>Limpar</Text>
        </TouchableOpacity>
      </View>
    </View>

            {/* ========== filtros ========== */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'Todas' && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab('Todas')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'Todas' && styles.tabTextActive,
                        ]}
                    >
                        Todas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'Críticos' && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab('Críticos')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'Críticos' && styles.tabTextActive,
                        ]}
                    >
                        Críticos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'Histórico' && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab('Histórico')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'Histórico' && styles.tabTextActive,
                        ]}
                    >
                        Histórico
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ========== LISTA DE ALERTAS ========== */}
            <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
                {/* Verifica se há alertas para mostrar */}
                {alerts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                        <Text style={styles.emptyStateText}>Sem alertas!</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Tudo está funcionando perfeitamente.
                        </Text>
                    </View>
                ) : (
                    <>
                        {alerts.map((alert) => (
                            <AlertCard
                                key={alert.id}
                                iconName={alert.iconName}
                                iconColor={alert.iconColor}
                                title={alert.title}
                                description={alert.description}
                                time={alert.time}
                                onDismiss={() => handleDismissAlert(alert.id)}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
            </SafeAreaView>

        </View>
    );
};

export default AlertsScreen;