import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SensorCard from "../components/SensorCard";
import { COLORS, GLOBAL_STYLES } from "../../shared/styles/globalStyles";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { getStyles } from "../../styles/dashboardStyles";

type RootStackParamList = {
  Dashboard: undefined;
  Configuracoes: undefined;
  Perfil: undefined;
};

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState("Quarto Sofia");
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={GLOBAL_STYLES.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>BabyGuard</Text>
            <Text style={styles.textMuted}>Monitoramento em tempo real</Text>
          </View>

          <TouchableOpacity
            style={[
              GLOBAL_STYLES.row,
              GLOBAL_STYLES.rowPadding,
              GLOBAL_STYLES.rowBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Perfil")}
          >
            <View style={GLOBAL_STYLES.avatar}>
              <Ionicons name="person" size={24} color={COLORS.textInverse} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Abas de dispositivos */}
        <View style={GLOBAL_STYLES.rowPadding}>
          <View style={GLOBAL_STYLES.row}>
            {["Quarto Sofia", "Sala", "+"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.btnSec,
                  activeTab === tab && GLOBAL_STYLES.buttonPrimary,
                  { marginRight: 8 },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.btnSecText,
                    activeTab === tab && GLOBAL_STYLES.buttonPrimaryText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Card de status */}
        <View style={styles.card}>
          <Text style={styles.title}>Tudo tranquilo</Text>
          <Text style={styles.textMuted}>Última leitura: agora há pouco</Text>

          <View style={[GLOBAL_STYLES.centerContent, { height: 80 }]}>
            <Text style={styles.textMuted}>[Ilustração]</Text>
          </View>
        </View>

        {/* Sensores */}
        <View style={GLOBAL_STYLES.sectionHeader}>
          <Text style={styles.sectionTitle}>SENSORES EM TEMPO REAL</Text>
        </View>

        <View style={styles.card}>
          <View style={[GLOBAL_STYLES.row, { flexWrap: "wrap", justifyContent: "space-between" }]}>
            <SensorCard
              iconName="thermometer-outline"
              label="Temperatura"
              value="26°C"
              status="Normal"
              statusColor={COLORS.success}
              iconColor="#FF6B6B"
            />
            <SensorCard
              iconName="water-outline"
              label="Umidade"
              value="52%"
              status="Normal"
              statusColor={COLORS.success}
              iconColor="#4ECDC4"
            />
            <SensorCard
              iconName="sunny-outline"
              label="Luminosidade"
              value="Baixa"
              status="Normal"
              statusColor={COLORS.success}
              iconColor="#FFD93D"
            />
            <SensorCard
              iconName="body-outline"
              label="Presença"
              value="Calmo"
              status="Normal"
              statusColor={COLORS.success}
              iconColor="#A78BFA"
            />
          </View>
        </View>

        {/* Gráfico */}
        <View style={styles.card}>
          <View style={GLOBAL_STYLES.spaceBetween}>
            <Text style={styles.subtitle}>Variação de temperatura</Text>

            <View style={GLOBAL_STYLES.row}>
              {["1h", "6h", "24h"].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.btnSec,
                    period === "1h" && GLOBAL_STYLES.buttonPrimary,
                    { marginLeft: 6 },
                  ]}
                >
                  <Text
                    style={[
                      styles.btnSecText,
                      period === "1h" && GLOBAL_STYLES.buttonPrimaryText,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[GLOBAL_STYLES.centerContent, { height: 140 }]}>
            <Text style={styles.textMuted}>[Gráfico de linha aqui]</Text>
          </View>

          <View style={GLOBAL_STYLES.spaceBetween}>
            {["14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h"].map((hour) => (
              <Text key={hour} style={styles.textMuted}>{hour}</Text>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
