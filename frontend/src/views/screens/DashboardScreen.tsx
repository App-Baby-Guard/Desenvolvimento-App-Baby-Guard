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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../shared/styles/globalStyles';


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

      {/* ========== Linha dos DISPOSITIVOS ========== */}
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

      {/* ========== Card onde fica os SENSORES ========== */}
      {/* TODO: Substituir os valores dos sensores fixos pelos sensores reais conectados */}
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
        {/* TODO Adicionar o gráfico real de temperatura, substituindo o placeholder */}
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


      <View style={styles.bottomSpacer} /> {/* espaço pra separar o conteúdo da barra de navegação do final do celular */}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },

  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //========== nome dos dispositivos ==========
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },

  tabButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  tabButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  tabText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },

  tabTextActive: {
    color: COLORS.textInverse,
  },

  //========== card do resumo ==========
  welcomeCard: {
    backgroundColor: '#E8F5E9', // Verde suave
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xxl,
  },

  welcomeTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: '#2E7D32', // Verde escuro
    marginBottom: SPACING.xs,
  },

  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: '#66BB6A', // Verde médio
    marginBottom: SPACING.md,
  },

  welcomeIllustrationPlaceholder: {
    height: 60,
    backgroundColor: '#C8E6C9', // Verde mais claro
    borderRadius: BORDER_RADIUS.sm,
  },

  //========== Card dos SENSORES ==========
  sensorSection: {
    marginBottom: SPACING.xxl,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },

  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

 // ========== SEÇÃO DE GRÁFICO ==========
  chartSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  chartTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  chartFilters: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },

  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceSoft,
  },

  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  filterTextActive: {
    color: COLORS.textInverse,
  },

  chartPlaceholder: {
    height: 120,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  chartPlaceholderText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
  },

  chartAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  axisLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },


  bottomSpacer: {
    height: SPACING.lg,
  },
});

export default DashboardScreen;