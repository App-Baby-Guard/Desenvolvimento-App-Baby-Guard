import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlertCard from '../components/AlertCard';

const AlertsScreen: React.FC = () => {
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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Alertas</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.headerButton}>Limpar</Text>
                </TouchableOpacity>
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

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    headerButton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0066FF',
    },

    // ========== filtros ==========
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        gap: 8,
    },

    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
    },

    // filtro ativa
    tabButtonActive: {
        backgroundColor: '#0066FF',
    },

    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666666',
    },

    tabTextActive: {
        color: '#FFFFFF',
    },

    // ========== LISTA DE ALERTAS ==========
    alertsList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    // ========== ESTADO VAZIO ==========
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },

    emptyStateText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 12,
    },

    emptyStateSubtext: {
        fontSize: 12,
        color: '#888888',
        marginTop: 4,
    },

    bottomSpacer: {
        height: 20,
    },
});

export default AlertsScreen;