import React, { useEffect, useCallback, useMemo, useReducer } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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

// ─── GERENCIAMENTO DE ESTADO CENTRALIZADO (Arquitetura Flux/Reducer) ──────
// Utilizei useReducer no lugar de múltiplos useState para aplicar princípios
// de Clean Code e evitar inconsistências (ex: terminar o loading antes dos dados chegarem).

// 1. Interface do Estado: Define o "molde" exato de todos os dados que a tela precisa.
interface DashboardState {
  dispositivos: Dispositivo[]; // Lista de todos os robôs do usuário
  dispositivoAtivo: Dispositivo | null; // O robô selecionado na tela no momento
  leituras: LeituraSensor[]; // Dados em tempo real (temperatura, umidade atual)
  historicoLeituras: LeituraHistorico[]; // Dados passados para montar o gráfico
  loading: boolean; // Controle da tela de carregamento (a "rodinha" girando)
}

// 2. Tipos de Ações permitidas: Funciona como um "Cardápio" restrito. 
// O estado da tela só pode ser alterado enviando (dispatch) uma dessas ações exatas.
type DashboardAction =
  | { type: "START_LOADING" } // Aciona a tela de carregamento
  | { type: "SET_DISPOSITIVOS"; payload: { dispositivos: Dispositivo[]; ativo: Dispositivo | null } } // Salva os robôs encontrados no banco
  | { type: "SELECT_DISPOSITIVO"; payload: Dispositivo } // Troca a aba do robô selecionado
  | { type: "SET_LEITURAS"; payload: { leituras: LeituraSensor[]; historico: LeituraHistorico[] } } // Atualiza os dados dos sensores
  | { type: "STOP_LOADING" }; // Para o carregamento (usado em caso de erros)

// 3. Função Redutora (O Cérebro): É uma "Função Pura" que recebe o Estado Atual e uma Ação,
// e retorna o NOVO estado completo e atualizado, sempre de forma imutável (usando ...state).
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loading: true };
    case "SET_DISPOSITIVOS":
      return {
        ...state,
        dispositivos: action.payload.dispositivos,
        dispositivoAtivo: action.payload.ativo,
        loading: false, // Ao receber os dispositivos, paramos o loading automaticamente
      };
    case "SELECT_DISPOSITIVO":
      return { ...state, dispositivoAtivo: action.payload };
    case "SET_LEITURAS":
      return {
        ...state,
        leituras: action.payload.leituras,
        historicoLeituras: action.payload.historico,
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

  // 4. Inicializando o useReducer: O 'state' guarda os dados, e o 'dispatch' é a arma que dispara as Ações.
  const [state, dispatch] = useReducer(dashboardReducer, {
    dispositivos: [],
    dispositivoAtivo: null,
    leituras: [],
    historicoLeituras: [],
    loading: true, // Começa carregando a tela por padrão
  });

  // Desestruturando para facilitar o uso das variáveis no restante do código (HTML/JSX)
  const { dispositivos, dispositivoAtivo, leituras, historicoLeituras, loading } = state;

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
      // Promise.all permite buscar o tempo real e o histórico ao mesmo tempo, sem lentidão.
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
    // Evita recarregar a tela, perder estado e fazer requests inúteis se for o mesmo robô
    if (dispositivoAtivo?.uuid_dispositivo === disp.uuid_dispositivo) return;

    dispatch({ type: "SELECT_DISPOSITIVO", payload: disp });
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

  // Função responsável por renderizar o gráfico histórico de temperatura
  const renderGrafico = () => {
    // Filtra nulls e inverter a ordem (cronológico: mais antigo -> mais novo)
    const validData = [...historicoLeituras]
      .reverse()
      .filter((l) => l.temperatura !== null && l.temperatura !== undefined);

    // se faltam dados
    if (validData.length < 2) {
      return (
        <View style={[GLOBAL_STYLES.centerContent, { height: 140, marginTop: SPACING.md }]}>
          <Text style={styles.textMuted}>Sem leituras suficientes para o gráfico</Text>
        </View>
      );
    }

    const labels: string[] = [];
    const data: number[] = [];
    const step = Math.ceil(validData.length / 5); // Distribui os labels de hora em 5 pontos para não poluir o eixo X

    validData.forEach((item, index) => {
      // converte string para number, garantindo a compatibilidade matemática
      data.push(Number(item.temperatura));

      // UTC (usado no serviço de Alertas)
      let isoString = String(item.data_hora).trim().replace(' ', 'T');
      if (!isoString.includes('Z') && !isoString.match(/[+-]\d{2}:\d{2}$/)) {
        isoString += 'Z';
      }
      const dataLocal = new Date(isoString);
      const horaFormatada = `${String(dataLocal.getHours()).padStart(2, '0')}:${String(dataLocal.getMinutes()).padStart(2, '0')}`;

      // Insere o texto apenas nas posições calculadas. Os demais ficam em branco (mas o ponto no eixo Y existe)
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
          width={Dimensions.get("window").width - 64} // Compensa os paddings de tela e de Card
          height={180}
          yAxisSuffix="°"
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, // Cor baseada na temperatura do SensorCard (#FF6B6B)
            labelColor: () => styles.textMuted.color as string,
            propsForDots: { r: "3", strokeWidth: "2", stroke: "#FF6B6B" },
            propsForBackgroundLines: { stroke: styles.textMuted.color as string, strokeOpacity: 0.2 },
          }}
          bezier // Transforma os ângulos duros em curvas suaves e fluidas
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
          </View>

          {renderGrafico()}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
