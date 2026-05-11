import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SensorCard from '../components/SensorCard';

const DashboardScreen: React.FC = () => {
   
    const [activeTab, setActiveTab] = useState('Quarto Sofia');

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>BabyGuard</Text>
                    <Text style={styles.headerSubtitle}>Monitoramento em tempo real</Text>
                </View>

                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
            </View>

            {/* ========== ABAS DE DISPOSITIVOS ========== */}
            <View style={styles.tabsContainer}>
                {['Quarto Sofia', 'Sala', 'Adicionar'].map((tab) => ( //TODO: Substituir os dispositivos fixos pelos adicionados
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.tabButtonActive,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.tabTextActive,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.welcomeCard}>
                <Text style={styles.welcomeTitle}>Tudo tranquilo</Text>
                <Text style={styles.welcomeSubtitle}>Última leitura: agora há pouco</Text>
                <View style={styles.welcomeIllustrationPlaceholder} />
            </View>

            {/* ========== SENSORES ========== */}
            <View style={styles.sensorSection}>
                <Text style={styles.sectionTitle}>SENSORES EM TEMPO REAL</Text>

                <View style={styles.sensorGrid}>
                    <SensorCard
                        iconName="thermometer-outline"
                        label="Temperatura"
                        value="26°C"
                        status="Normal"
                        statusColor="#4CAF50"
                        iconColor="#FF6B6B"
                    />
                    <SensorCard
                        iconName="water-outline"
                        label="Umidade"
                        value="52%"
                        status="Normal"
                        statusColor="#4CAF50"
                        iconColor="#4ECDC4"
                    />
                    <SensorCard
                        iconName="sunny-outline"
                        label="Luminosidade"
                        value="Baixa"
                        status="Normal"
                        statusColor="#4CAF50"
                        iconColor="#FFD93D"
                    />
                    <SensorCard
                        iconName="body-outline"
                        label="Presença"
                        value="Calmo"
                        status="Normal"
                        statusColor="#4CAF50"
                        iconColor="#A78BFA"
                    />
                </View>
            </View>

            {/* ========== GRÁFICO DE TEMPERATURA ========== */}
            <View style={styles.chartSection}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Variação de temperatura</Text>
                    <View style={styles.chartFilters}>
                        {['1h', '6h', '24h'].map((period) => ( //TODO: Adicionar as variações reais de temperatura
                            <TouchableOpacity
                                key={period}
                                style={[
                                    styles.filterButton,
                                    period === '1h' && styles.filterButtonActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        period === '1h' && styles.filterTextActive,
                                    ]}
                                >
                                    {period}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.chartPlaceholder}>
                    <Text style={styles.chartPlaceholderText}>
                        [Gráfico de linha aqui]
                    </Text>
                </View>

                <View style={styles.chartAxisLabels}>
                    {['14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h'].map(
                        (hour) => (
                            <Text key={hour} style={styles.axisLabel}>
                                {hour}
                            </Text>
                        )
                    )}
                </View>
            </View>

            {/* ========== BARRA DE NAVEGAÇÃO - tab ========== */}
            <View style={styles.navigationBar}>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={24} color="#0066FF" />
                    <Text style={[styles.navLabel, { color: '#0066FF' }]}>Início</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="notifications-outline" size={24} color="#888888" />
                    <Text style={styles.navLabel}>Alertas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="hardware-chip-outline" size={24} color="#888888" />
                    <Text style={styles.navLabel}>Robôs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="settings-outline" size={24} color="#888888" />
                    <Text style={styles.navLabel}>Config.</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person-outline" size={24} color="#888888" />
                    <Text style={styles.navLabel}>Perfil</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.bottomSpacer} />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== ABAS ==========
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },

  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  tabButtonActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
  },

  tabTextActive: {
    color: '#FFFFFF',
  },

  // ========== BEM-VINDA ==========
  welcomeCard: {
    backgroundColor: '#E8F5E9', // Verde suave
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },

  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32', // Verde escuro
    marginBottom: 4,
  },

  welcomeSubtitle: {
    fontSize: 12,
    color: '#66BB6A', // Verde médio
    marginBottom: 12,
  },

  welcomeIllustrationPlaceholder: {
    height: 60,
    backgroundColor: '#C8E6C9', // Verde mais claro
    borderRadius: 8,
  },

  // ========== SENSORES ==========
  sensorSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#AAAAAA',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // ========== SEÇÃO DE GRÁFICO ==========
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  chartFilters: {
    flexDirection: 'row',
    gap: 4,
  },

  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },

  filterButtonActive: {
    backgroundColor: '#0066FF',
  },

  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  chartPlaceholder: {
    height: 120,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  chartPlaceholderText: {
    fontSize: 12,
    color: '#CCCCCC',
  },

  chartAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  axisLabel: {
    fontSize: 10,
    color: '#CCCCCC',
  },

  // ========== AÇÕES RÁPIDAS ==========
  quickActionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  quickActionContent: {
    flex: 1,
  },

  // Container para ícone + da ação rápida
  quickActionIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  quickActionStatus: {
    fontSize: 11,
    color: '#888888',
  },

  // ========== NAVEGAÇÃO  ==========
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    justifyContent: 'space-around',
    marginHorizontal: -16,
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    flex: 1,
  },

  navLabel: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '500',
    marginTop: 4,
  },

  bottomSpacer: {
    height: 20,
  },
});

export default DashboardScreen;