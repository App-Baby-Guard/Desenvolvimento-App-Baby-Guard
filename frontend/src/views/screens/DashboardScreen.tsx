import React, { useEffect, useCallback, useMemo, useReducer } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
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
import { BLYNK_STATIC_TOKEN } from "../../services/blynkService";
import { Dispositivo } from "../../models/Dispositivo";
import { useAuth } from "../../context/AuthContext";
import { LineChart } from "react-native-chart-kit";

// Tipagem precisa para substituir o uso de "any[]" no histórico do gráfico
export interface LeituraHistorico {
  data_hora: string;
  temperatura: number | string | null;
  umidade: number | string | null;
  luminosidade: number | string | null;
  movimento: boolean | null;
}

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

// Quando o monitoramento estiver desativado, o status geral reflete isso
function calcularStatusGeral(leituras: LeituraSensor[], isDeviceOn: boolean): { texto: string; cor: string } {
  if (!isDeviceOn) return { texto: "Monitoramento Desativado", cor: COLORS.textTertiary };
  
  const temp = getLeituraByTipo(leituras, "temperatura");
  const umid = getLeituraByTipo(leituras, "umidade");
  const mov = getLeituraByTipo(leituras, "movimento");

  if (temp && getValorNum(temp) > 28) return { texto: "Atenção! Temperatura elevada", cor: "#E53935" };
  if (umid && getValorNum(umid) < 40) return { texto: "Umidade baixa detectada", cor: "#F59E0B" };
  if (mov && mov.movimento) return { texto: "Movimento detectado", cor: "#F59E0B" };
  return { texto: "Tudo tranquilo", cor: COLORS.success };
}

function tempoDesdeUltimaLeitura(leituras: LeituraSensor[], isDeviceOn: boolean): string {
  if (!isDeviceOn) return "Notificações pausadas";
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

// ─── GERENCIAMENTO DE ESTADO CENTRALIZADO (Arquitetura Flux/Reducer) ──────
interface DashboardState {
  dispositivos: Dispositivo[];
  dispositivoAtivo: Dispositivo | null;
  leituras: LeituraSensor[];
  historicoLeituras: LeituraHistorico[];
  loading: boolean;
  isDeviceOn: boolean;
}

type DashboardAction =
  | { type: "START_LOADING" }
  | { type: "SET_DISPOSITIVOS"; payload: { dispositivos: Dispositivo[]; ativo: Dispositivo | null } }
  | { type: "SELECT_DISPOSITIVO"; payload: Dispositivo }
  | { type: "SET_LEITURAS"; payload: { leituras: LeituraSensor[]; historico: LeituraHistorico[] } }
  | { type: "SET_DEVICE_STATUS"; payload: boolean }
  | { type: "STOP_LOADING" };

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loading: true };
    case "SET_DISPOSITIVOS":
      return {
        ...state,
        dispositivos: action.payload.dispositivos,
        dispositivoAtivo: action.payload.ativo,
        loading: false,
      };
    case "SELECT_DISPOSITIVO":
      return { ...state, dispositivoAtivo: action.payload };
    case "SET_LEITURAS":
      return {
        ...state,
        leituras: action.payload.leituras,
        historicoLeituras: action.payload.historico,
      };
    case "SET_DEVICE_STATUS":
      return {
        ...state,
        isDeviceOn: action.payload,
      };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
}

const INTERVALO_POLLING = 60000; // 60 segundos (Sincronizado com o Worker do Backend)

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  // Inicializando o useReducer
  const [state, dispatch] = useReducer(dashboardReducer, {
    dispositivos: [],
    dispositivoAtivo: null,
    leituras: [],
    historicoLeituras: [],
    loading: true,
    isDeviceOn: true,
  });

  const { dispositivos, dispositivoAtivo, leituras, historicoLeituras, loading, isDeviceOn } = state;
  const { usuario } = useAuth();

  // Atualização de dispositivos ao entrar em foco
  useEffect(() => {
    if (isFocused) {
      carregarDispositivos();
    }
  }, [isFocused]);

  // Polling para ler o estado de standby diretamente do Blynk
  useEffect(() => {
    if (!isFocused) return;

    const carregarStatusBlynkV7 = async () => {
      const token = dispositivoAtivo?.token_dispositivo || BLYNK_STATIC_TOKEN;
      if (!token) {
        console.warn("[Dashboard] Token do Blynk não configurado");
        dispatch({ type: "SET_DEVICE_STATUS", payload: false });
        return;
      }

      try {
        const url = `https://blynk.cloud/external/api/get?token=${encodeURIComponent(token)}&v7`;
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          const statusVal = text.trim();
          dispatch({ type: "SET_DEVICE_STATUS", payload: statusVal === "1" });
        } else {
          console.warn("[Dashboard] Erro na resposta do Blynk Cloud:", response.status);
          dispatch({ type: "SET_DEVICE_STATUS", payload: false });
        }
      } catch (error) {
        console.log("[Dashboard] Erro ao ler status Blynk diretamente da API:", error);
      }
    };

    carregarStatusBlynkV7();
    const intervalStatus = setInterval(carregarStatusBlynkV7, 5000); // Polling de 5s para refletir standby na hora
    return () => clearInterval(intervalStatus);
  }, [isFocused, dispositivoAtivo?.token_dispositivo]);

  // Polling de leituras do banco quando a tela está em foco e o dispositivo está ativo
  useEffect(() => {
    if (!isFocused || !dispositivoAtivo || !dispositivoAtivo.id_dispositivo || !isDeviceOn) return;

    const id = dispositivoAtivo.id_dispositivo;
    buscarLeituras(id);

    const interval = setInterval(() => {
      buscarLeituras(id);
    }, INTERVALO_POLLING);

    return () => clearInterval(interval);
  }, [isFocused, dispositivoAtivo?.id_dispositivo, isDeviceOn]);

  async function carregarDispositivos() {
    try {
      dispatch({ type: "START_LOADING" });
      const dados = await listarDispositivos();
      dispatch({
        type: "SET_DISPOSITIVOS",
        payload: {
          dispositivos: dados,
          ativo: dados.length > 0 ? dados[0] : null
        }
      });
    } catch (error) {
      console.error("Erro ao carregar dispositivos:", error);
      dispatch({ type: "STOP_LOADING" });
    }
  }

  async function buscarLeituras(id_dispositivo: number) {
    try {
      const [dadosUltimas, dadosHistorico] = await Promise.all([
        buscarUltimasLeiturasPorDispositivo(id_dispositivo),
        buscarHistoricoLeituras()
      ]);
      dispatch({
        type: "SET_LEITURAS",
        payload: { leituras: dadosUltimas, historico: dadosHistorico }
      });
    } catch (error) {
      console.error("Erro ao buscar leituras:", error);
    }
  }

  function selecionarDispositivo(disp: Dispositivo) {
    if (dispositivoAtivo?.uuid_dispositivo === disp.uuid_dispositivo) return;
    dispatch({ type: "SELECT_DISPOSITIVO", payload: disp });
  }

  // Leituras dos sensores
  const tempLeitura = getLeituraByTipo(leituras, "temperatura");
  const umidLeitura = getLeituraByTipo(leituras, "umidade");
  const luzLeitura = getLeituraByTipo(leituras, "luminosidade");
  const movLeitura = getLeituraByTipo(leituras, "movimento");

  const tempStatus = calcularStatus(tempLeitura, "temperatura");
  const umidStatus = calcularStatus(umidLeitura, "umidade");
  const luzStatus = calcularStatus(luzLeitura, "luminosidade");
  const movStatus = calcularStatus(movLeitura, "movimento");

  const statusGeral = calcularStatusGeral(leituras, isDeviceOn);
  const ultimaLeitura = tempoDesdeUltimaLeitura(leituras, isDeviceOn);

  // Função responsável por renderizar o gráfico histórico de temperatura
  const renderGrafico = () => {
    if (!isDeviceOn) {
      return (
        <View style={[GLOBAL_STYLES.centerContent, { height: 140, marginTop: SPACING.md }]}> 
          <Text style={styles.textMuted}>Monitoramento pausado. O gráfico será exibido novamente quando o dispositivo voltar ao modo ativo.</Text>
        </View>
      );
    }

    const validData = [...historicoLeituras]
      .reverse()
      .filter((item) => {
        const temperatura = Number(item.temperatura);
        return Number.isFinite(temperatura);
      });

    if (validData.length < 2) {
      return (
        <View style={[GLOBAL_STYLES.centerContent, { height: 140, marginTop: SPACING.md }]}> 
          <Text style={styles.textMuted}>Sem leituras suficientes para o gráfico</Text>
        </View>
      );
    }

    const labels: string[] = [];
    const data: number[] = [];
    const step = Math.max(1, Math.ceil(validData.length / 5));

    validData.forEach((item, index) => {
      const temperatura = Number(item.temperatura);
      data.push(temperatura);

      let isoString = String(item.data_hora).trim().replace(' ', 'T');
      if (!isoString.includes('Z') && !isoString.match(/[+-]\d{2}:\d{2}$/)) {
        isoString += 'Z';
      }
      const dataLocal = new Date(isoString);
      const horaFormatada = `${String(dataLocal.getHours()).padStart(2, '0')}:${String(dataLocal.getMinutes()).padStart(2, '0')}`;

      if (index === 0 || index === validData.length - 1 || index % step === 0) {
        labels.push(horaFormatada);
      } else {
        labels.push("");
      }
    });

    return (
      <View style={{ marginTop: SPACING.md, alignItems: "center" }}>
        <LineChart
          data={{ labels, datasets: [{ data }] }}
          width={Dimensions.get("window").width - 64}
          height={180}
          yAxisSuffix="°"
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
            labelColor: () => styles.textMuted.color as string,
            propsForDots: { r: "3", strokeWidth: "2", stroke: "#FF6B6B" },
            propsForBackgroundLines: { stroke: styles.textMuted.color as string, strokeOpacity: 0.2 },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
    );
  };

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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

              {dispositivos.length === 0 ? (
                <TouchableOpacity
                  style={[
                    GLOBAL_STYLES.buttonPrimary,
                    {
                      paddingHorizontal: SPACING.md,
                      paddingVertical: SPACING.sm,
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => navigation.getParent()?.navigate("NovoRobo" as any) || navigation.navigate("NovoRobo" as any)}
                >
                  <Ionicons name="add" size={20} color={COLORS.textInverse} style={{ marginRight: 4 }} />
                  <Text style={GLOBAL_STYLES.buttonPrimaryText}>Adicionar primeiro Robô</Text>
                </TouchableOpacity>
              ) : (
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
              )}
            </View>
          </ScrollView>
        </View>

        {/* Card de aviso de monitoramento desligado e notificações pausadas */}
        {!isDeviceOn && (
          <View style={[
            styles.card,
            {
              flexDirection: 'row',
              alignItems: 'center',
              borderLeftWidth: 4,
              borderLeftColor: COLORS.textTertiary,
            }
          ]}>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: SPACING.md
            }}>
              <Ionicons
                name="moon"
                size={22}
                color={COLORS.textSecondary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subtitle, { marginBottom: 2 }]}>
                Modo Standby
              </Text>
              <Text style={styles.textMuted}>
                O monitoramento em tempo real está pausado.
              </Text>
            </View>
          </View>
        )}

        {/* Card de status */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>{statusGeral.texto}</Text>
              <Text style={styles.textMuted}>{ultimaLeitura}</Text>
            </View>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: isDeviceOn ? COLORS.success : COLORS.error
            }} />
          </View>

            {(!isDeviceOn || leituras.length === 0) && dispositivoAtivo && (
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
              value={isDeviceOn ? formatarValor(tempLeitura, "temperatura") : '—'}
              status={isDeviceOn ? tempStatus.status : 'Sem dados'}
              statusColor={isDeviceOn ? tempStatus.color : COLORS.textTertiary}
              iconColor="#FF6B6B"
              progress={isDeviceOn ? calcularProgresso(tempLeitura, "temperatura") : 0}
            />
            <SensorCard
              iconName="water-outline"
              label="Umidade"
              value={isDeviceOn ? formatarValor(umidLeitura, "umidade") : '—'}
              status={isDeviceOn ? umidStatus.status : 'Sem dados'}
              statusColor={isDeviceOn ? umidStatus.color : COLORS.textTertiary}
              iconColor="#4ECDC4"
              progress={isDeviceOn ? calcularProgresso(umidLeitura, "umidade") : 0}
            />
            <SensorCard
              iconName="sunny-outline"
              label="Luminosidade"
              value={isDeviceOn ? formatarValor(luzLeitura, "luminosidade") : '—'}
              status={isDeviceOn ? luzStatus.status : 'Sem dados'}
              statusColor={isDeviceOn ? luzStatus.color : COLORS.textTertiary}
              iconColor="#FFD93D"
              progress={isDeviceOn ? calcularProgresso(luzLeitura, "luminosidade") : 0}
            />
            <SensorCard
              iconName="body-outline"
              label="Presença"
              value={isDeviceOn ? formatarValor(movLeitura, "movimento") : '—'}
              status={isDeviceOn ? movStatus.status : 'Sem dados'}
              statusColor={isDeviceOn ? movStatus.color : COLORS.textTertiary}
              iconColor="#A78BFA"
              progress={isDeviceOn ? calcularProgresso(movLeitura, "movimento") : 0}
            />
          </View>
        </View>

        {/* Gráfico */}
        <View style={styles.card}>
          <View style={GLOBAL_STYLES.spaceBetween}>
            <Text style={styles.subtitle}>Variação de temperatura</Text>
          </View>

          {renderGrafico()}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
