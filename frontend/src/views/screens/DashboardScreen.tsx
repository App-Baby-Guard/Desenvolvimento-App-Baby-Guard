import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SensorCard from "../components/SensorCard";
import { COLORS, GLOBAL_STYLES, SPACING } from "../../shared/styles/globalStyles";
import { useNavigation, NavigationProp, useIsFocused } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { getStyles } from "../../styles/dashboardStyles";

import { listarDispositivos } from "../../services/dispositivosService";
import { buscarUltimasLeiturasPorDispositivo, buscarHistoricoLeituras, LeituraSensor } from "../../services/leiturasService";
import { Dispositivo } from "../../models/Dispositivo";
import { useAuth } from "../../context/AuthContext";

type RootStackParamList = {
  Dashboard: undefined;
  Configuracoes: undefined;
  Perfil: undefined;
};

// ─── Funções auxiliares para interpretar leituras ────────────────────
function getLeituraByTipo(leituras: LeituraSensor[], tipo: string): LeituraSensor | undefined {
  return leituras.find((l) => l.tipo_sensor === tipo);
}

function getValorNum(leitura: LeituraSensor | undefined): number {
  if (!leitura || leitura.valor === null || leitura.valor === undefined) return 0;
  return Number(leitura.valor) || 0;
}

function formatarValor(leitura: LeituraSensor | undefined, tipo: string): string {
  if (!leitura) return "—";
  const val = getValorNum(leitura);
  if (tipo === "temperatura") return `${val.toFixed(1)}°C`;
  if (tipo === "umidade") return `${val.toFixed(0)}%`;
  if (tipo === "luminosidade") {
    if (val < 100) return "Baixa";
    if (val < 500) return "Média";
    return "Alta";
  }
  if (tipo === "movimento") return leitura.movimento ? "Detectado" : "Calmo";
  return String(leitura.valor ?? "—");
}

function calcularStatus(leitura: LeituraSensor | undefined, tipo: string): { status: string; color: string } {
  if (!leitura) return { status: "Sem dados", color: COLORS.textTertiary };
  const val = getValorNum(leitura);
  if (tipo === "temperatura") {
    if (val > 28) return { status: "Alto", color: "#E53935" };
    if (val < 18) return { status: "Baixo", color: "#1565C0" };
    return { status: "Normal", color: COLORS.success };
  }
  if (tipo === "umidade") {
    if (val < 40) return { status: "Baixa", color: "#F59E0B" };
    if (val > 70) return { status: "Alta", color: "#1565C0" };
    return { status: "Normal", color: COLORS.success };
  }
  if (tipo === "luminosidade") {
    if (val > 800) return { status: "Intensa", color: "#F59E0B" };
    return { status: "Normal", color: COLORS.success };
  }
  if (tipo === "movimento") {
    if (leitura.movimento) return { status: "Alerta", color: "#F59E0B" };
    return { status: "Normal", color: COLORS.success };
  }
  return { status: "Normal", color: COLORS.success };
}

function calcularProgresso(leitura: LeituraSensor | undefined, tipo: string): number {
  if (!leitura) return 0;
  const val = getValorNum(leitura);
  if (tipo === "temperatura") return Math.min(100, (val / 40) * 100);
  if (tipo === "umidade") return Math.min(100, val);
  if (tipo === "luminosidade") return Math.min(100, (val / 1000) * 100);
  if (tipo === "movimento") return leitura.movimento ? 100 : 10;
  return 50;
}

function calcularStatusGeral(leituras: LeituraSensor[]): { texto: string; cor: string } {
  const temp = getLeituraByTipo(leituras, "temperatura");
  const umid = getLeituraByTipo(leituras, "umidade");
  const mov = getLeituraByTipo(leituras, "movimento");

  if (temp && getValorNum(temp) > 28) return { texto: "Atenção! Temperatura elevada", cor: "#E53935" };
  if (umid && getValorNum(umid) < 40) return { texto: "Umidade baixa detectada", cor: "#F59E0B" };
  if (mov && mov.movimento) return { texto: "Movimento detectado", cor: "#F59E0B" };
  return { texto: "Tudo tranquilo", cor: COLORS.success };
}

function tempoDesdeUltimaLeitura(leituras: LeituraSensor[]): string {
  if (leituras.length === 0) return "Sem leituras ainda";
  const maisRecente = leituras.reduce((a, b) =>
    new Date(a.data_hora) > new Date(b.data_hora) ? a : b
  );
  const diff = Date.now() - new Date(maisRecente.data_hora).getTime();
  const segundos = Math.floor(diff / 1000);
  if (segundos < 10) return "Última leitura: agora há pouco";
  if (segundos < 60) return `Última leitura: ${segundos}s atrás`;
  const minutos = Math.floor(segundos / 60);
  return `Última leitura: ${minutos}min atrás`;
}

// ─── Componente Principal ───────────────────────────────────────────
const INTERVALO_POLLING = 60000; // 60 segundos (Sincronizado com o Worker do Backend)

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [dispositivoAtivo, setDispositivoAtivo] = useState<Dispositivo | null>(null);
  const [leituras, setLeituras] = useState<LeituraSensor[]>([]);
  const [historicoLeituras, setHistoricoLeituras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { usuario } = useAuth();

  // [ATUALIZAÇÃO EM TEMPO REAL]
  // Aqui eu resolvi o problema de "dados antigos". Antes, se eu criasse um robô
  // em outra aba e voltasse pra cá, a tela não exibia o robô novo.
  // Colocando o `isFocused` como dependência, eu forço o React a rodar `carregarDispositivos()`
  // TODA VEZ que o usuário clica na aba 'Dashboard' e a tela entra em foco.
  useEffect(() => {
    if (isFocused) {
      carregarDispositivos();
    }
  }, [isFocused]);

  // Polling de leituras quando a tela está em foco
  useEffect(() => {
    if (!isFocused || !dispositivoAtivo || !dispositivoAtivo.id_dispositivo) return;

    const id = dispositivoAtivo.id_dispositivo;

    // Buscar imediatamente
    buscarLeituras(id);

    // Polling a cada 5s
    const interval = setInterval(() => {
      buscarLeituras(id);
    }, INTERVALO_POLLING);

    return () => clearInterval(interval);
  }, [isFocused, dispositivoAtivo?.id_dispositivo]);

  async function carregarDispositivos() {
    try {
      setLoading(true);
      const dados = await listarDispositivos();
      setDispositivos(dados);
      if (dados.length > 0) {
        setDispositivoAtivo(dados[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar dispositivos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function buscarLeituras(id_dispositivo: number) {
    try {
      // Promise.all permite buscar o tempo real e o histórico ao mesmo tempo, sem lentidão.
      const [dadosUltimas, dadosHistorico] = await Promise.all([
        buscarUltimasLeiturasPorDispositivo(id_dispositivo),
        buscarHistoricoLeituras()
      ]);
      setLeituras(dadosUltimas);
      setHistoricoLeituras(dadosHistorico);
    } catch (error) {
      console.error("Erro ao buscar leituras:", error);
    }
  }

  function selecionarDispositivo(disp: Dispositivo) {
    // Evita recarregar a tela, perder estado e fazer requests inúteis se for o mesmo robô
    if (dispositivoAtivo?.uuid_dispositivo === disp.uuid_dispositivo) return;

    setDispositivoAtivo(disp);
  }

  // Dados dinâmicos dos sensores baseados na API:
  const tempLeitura = getLeituraByTipo(leituras, "temperatura");
  const umidLeitura = getLeituraByTipo(leituras, "umidade");
  const luzLeitura = getLeituraByTipo(leituras, "luminosidade");
  const movLeitura = getLeituraByTipo(leituras, "movimento");



  const tempStatus = calcularStatus(tempLeitura, "temperatura");
  const umidStatus = calcularStatus(umidLeitura, "umidade");
  const luzStatus = calcularStatus(luzLeitura, "luminosidade");
  const movStatus = calcularStatus(movLeitura, "movimento");

  const statusGeral = calcularStatusGeral(leituras);
  const ultimaLeitura = tempoDesdeUltimaLeitura(leituras);

  if (loading) {
    return (
      <SafeAreaView style={[GLOBAL_STYLES.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.sm }]}>
          Carregando dispositivos...
        </Text>
      </SafeAreaView>
    );
  }

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
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Perfil")}
          >
            {usuario?.foto_perfil ? (
              <Image
                source={{ uri: usuario.foto_perfil }}
                style={styles.headerAvatar}
              />
            ) : (
              <View style={styles.headerAvatar}>
                <Ionicons
                  name="person"
              size={24}
                  color={COLORS.textInverse}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Abas de dispositivos */}
        <View style={GLOBAL_STYLES.rowPadding}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={GLOBAL_STYLES.row}>
              {dispositivos.map((disp) => (
                <TouchableOpacity
                  key={disp.uuid_dispositivo}
                  style={[
                    styles.btnSec,
                    dispositivoAtivo?.uuid_dispositivo === disp.uuid_dispositivo && GLOBAL_STYLES.buttonPrimary,
                    { marginRight: 8 },
                  ]}
                  onPress={() => selecionarDispositivo(disp)}
                >
                  <Text
                    style={[
                      styles.btnSecText,
                      dispositivoAtivo?.uuid_dispositivo === disp.uuid_dispositivo && GLOBAL_STYLES.buttonPrimaryText,
                    ]}
                    numberOfLines={1}
                  >
                    {disp.nome_dispositivo}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  GLOBAL_STYLES.buttonPrimary,
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => navigation.getParent()?.navigate("NovoRobo" as any) || navigation.navigate("NovoRobo" as any)}
              >
                <Ionicons name="add" size={24} color={COLORS.textInverse} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Card de status */}
        <View style={styles.card}>
          <Text style={styles.statusTitle}>{statusGeral.texto}</Text>
          <Text style={styles.textMuted}>{ultimaLeitura}</Text>

            {leituras.length === 0 && dispositivoAtivo && (
            <View style={styles.noDataContainer}>
              <Ionicons name="cloud-offline-outline" size={40} color={COLORS.textTertiary} />
              <Text style={[styles.textMuted, { marginTop: SPACING.sm, textAlign: "center" }]}>
                Nenhuma leitura recebida ainda.{"\n"}Aguardando conexão com o dispositivo...
              </Text>
            </View>
          )}
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
              value={formatarValor(tempLeitura, "temperatura")}
              status={tempStatus.status}
              statusColor={tempStatus.color}
              iconColor="#FF6B6B"
              progress={calcularProgresso(tempLeitura, "temperatura")}
            />
            <SensorCard
              iconName="water-outline"
              label="Umidade"
              value={formatarValor(umidLeitura, "umidade")}
              status={umidStatus.status}
              statusColor={umidStatus.color}
              iconColor="#4ECDC4"
              progress={calcularProgresso(umidLeitura, "umidade")}
            />
            <SensorCard
              iconName="sunny-outline"
              label="Luminosidade"
              value={formatarValor(luzLeitura, "luminosidade")}
              status={luzStatus.status}
              statusColor={luzStatus.color}
              iconColor="#FFD93D"
              progress={calcularProgresso(luzLeitura, "luminosidade")}
            />
            <SensorCard
              iconName="body-outline"
              label="Presença"
              value={formatarValor(movLeitura, "movimento")}
              status={movStatus.status}
              statusColor={movStatus.color}
              iconColor="#A78BFA"
              progress={calcularProgresso(movLeitura, "movimento")}
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
            {["14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h"].map(
              (hour) => (
                <Text key={hour} style={styles.textMuted}>
                  {hour}
                </Text>
              ),
            )}
          </View>
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
