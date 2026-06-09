import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, GLOBAL_STYLES, TYPOGRAPHY, BORDER_RADIUS } from '../../shared/styles/globalStyles';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from '../../styles/alertasStyles';
import { useIsFocused } from '@react-navigation/native';
import { limparHistoricoGeral, buscarHistoricoLeituras } from '../../services/leiturasService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EventoHistorico {
    id: string;
    titulo: string;
    descricao?: string;
    dataLabel: string;
    dataHoraCompleta: string;
    hora: string;
    timestamp: number;
    isAlert: boolean;
    iconName: keyof typeof Ionicons.glyphMap;
    iconBg: string;
    iconColor: string;
    textColor: string;
    barColor?: string;
}

function formatarDataLabel(data: Date): string {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    if (data.toDateString() === hoje.toDateString()) return "Hoje";
    if (data.toDateString() === ontem.toDateString()) return "Ontem";
    return data.toLocaleDateString("pt-BR");
}

// Interpreta a data crua do banco e garante que o celular a trate como UTC (Universal)
function parseDataUTC(dataString: string): Date {
    // Como o PostgreSQL guarda a data sem o fuso (timestamp without time zone), 
    // a API envia uma string crua como "2026-06-02 01:09:57".
    // Se o JS ler isso direto, ele acha que já é horário do Brasil e não subtrai as 3 horas.
    // A solução limpa na UI é forçar o formato ISO com "Z" (Zulu/UTC).
    let isoString = dataString.trim().replace(' ', 'T');
    if (!isoString.includes('Z') && !isoString.match(/[+-]\d{2}:\d{2}$/)) {
        isoString += 'Z';
    }
    return new Date(isoString);
}

// Extrai a hora local garantindo que os zeros à esquerda sejam mantidos (ex: 09:05)
function formatarHoraLocal(data: Date): string {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

//  Mapear leitura bruta da API para o formato visual esperado, colocando os sensores no mesmo card
function mapearLeitura(leitura: any, isDarkMode: boolean): EventoHistorico {

    const dataLocal = parseDataUTC(leitura.data_hora);

    const hora = formatarHoraLocal(dataLocal);

    // Formata a descrição com base nos sensores disponíveis naquela leitura
    const temp = leitura.temperatura !== null && leitura.temperatura !== undefined ? `${Number(leitura.temperatura).toFixed(1)} °C` : '--';
    const umid = leitura.umidade !== null && leitura.umidade !== undefined ? `${Number(leitura.umidade).toFixed(0)} %` : '--';
    const luz = leitura.luminosidade !== null && leitura.luminosidade !== undefined ? `${Number(leitura.luminosidade).toFixed(0)} Lux` : '--';
    const mov = leitura.movimento === true ? "Detectado" : (leitura.movimento === false ? "Calmo" : "--");

    const descricao = `Temperatura: ${temp}\nUmidade: ${umid}\nLuminosidade: ${luz}\nMovimento: ${mov}`;
    const dataLabel = formatarDataLabel(dataLocal);
    const dataHoraCompleta = `${dataLocal.toLocaleDateString("pt-BR")} ${hora}`;

    return {
        id: `leitura_${dataLocal.getTime()}`,
        titulo: "Leitura do Ambiente",
        descricao,
        dataLabel,
        dataHoraCompleta,
        hora,
        timestamp: dataLocal.getTime(),
        isAlert: false,
        iconName: 'analytics-outline',
        iconBg: isDarkMode ? 'rgba(150, 150, 150, 0.15)' : '#F0F4F8',
        iconColor: COLORS.primary,
        textColor: COLORS.textSecondary,
        barColor: COLORS.primary,
    };
}

const AlertasScreen: React.FC = () => {
    const isFocused = useIsFocused();
    const [filtroAtivo, setFiltroAtivo] = useState<'Leituras' | 'Alertas'>('Alertas');
    const { isDarkMode } = useTheme();
    const styles = getStyles(isDarkMode);

    const [eventos, setEventos] = useState<EventoHistorico[]>([]);
    const [leituras, setLeituras] = useState<EventoHistorico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            carregarDados();
        }
    }, [isFocused]);

    async function carregarDados() {
        try {
            setLoading(true);

            //  TENTA BUSCAR DADOS DA INTERNET (API)
            const dadosLeituras = await buscarHistoricoLeituras();

            // variáveis de limite usando os valores "padrão" como plano B
            let limiteTemperaturaMax = 26;
            let limiteTemperaturaMin = 20;
            let limiteUmidadeMax = 60;
            let limiteUmidadeMin = 40;

            //  Busca as configurações que o usuário salvou na memória do celular - AsyncStorage
            const configuracoesSalvas = await AsyncStorage.getItem("limites_sensores");

            if (configuracoesSalvas !== null) {
                // Transforma o texto que estava salvo (JSON) de volta em uma Lista para o Javascript
                const listaDeLimites = JSON.parse(configuracoesSalvas);

                // Procura a configuração da temperatura usando um nome descritivo para cada item da lista
                const configuracaoTemperatura = listaDeLimites.find((configuracaoAtual: any) => {
                    return configuracaoAtual.label === "Limite de Temperatura";
                });

                // Procura a configuração da umidade
                const configuracaoUmidade = listaDeLimites.find((configuracaoAtual: any) => {
                    return configuracaoAtual.label === "Limite de Umidade";
                });

                // Se encontrou a configuração da temperatura salva, atualiza as variáveis
                if (configuracaoTemperatura !== undefined) {
                    limiteTemperaturaMax = configuracaoTemperatura.max;
                    limiteTemperaturaMin = configuracaoTemperatura.min;
                }

                // Se encontrou a configuração da umidade salva, atualiza as variáveis
                if (configuracaoUmidade !== undefined) {
                    limiteUmidadeMax = configuracaoUmidade.max;
                    limiteUmidadeMin = configuracaoUmidade.min;
                }
            }

            // Separa as leituras: uma lista para os novos Alertas e outra para as Leituras Normais
            const novosAlertasLocais: EventoHistorico[] = [];
            const novasLeiturasNormais: EventoHistorico[] = [];

            //  Analisa  últimas 50 leituras vindas do banco de dados
            dadosLeituras.slice(0, 50).forEach((leituraBruta: any) => {
                const leituraFormatada = mapearLeitura(leituraBruta, isDarkMode);
                novasLeiturasNormais.push(leituraFormatada);

                const valorTemperatura = leituraBruta.temperatura !== null && leituraBruta.temperatura !== undefined ? Number(leituraBruta.temperatura) : null;
                const valorUmidade = leituraBruta.umidade !== null && leituraBruta.umidade !== undefined ? Number(leituraBruta.umidade) : null;

                const dataLocal = parseDataUTC(leituraBruta.data_hora);
                const hora = formatarHoraLocal(dataLocal);
                const dataLabel = formatarDataLabel(dataLocal);
                const dataHoraCompleta = `${dataLocal.toLocaleDateString("pt-BR")} ${hora}`;
                const ts = dataLocal.getTime();

                // Estilização condicional em variáveis limpas
                const tempColor = '#FF6B6B';
                const tempBg = isDarkMode ? 'rgba(255, 107, 107, 0.15)' : '#FFF0F0';
                const umidColor = '#4A90E2';
                const umidBg = isDarkMode ? 'rgba(74, 144, 226, 0.15)' : '#E6F0FA';

                // Analisa e cria Alerta de Temperatura
                if (valorTemperatura !== null) {
                    if (valorTemperatura > limiteTemperaturaMax) {
                        novosAlertasLocais.push({
                            id: `alerta_temp_alta_${ts}`,
                            titulo: 'Temperatura Alta',
                            descricao: `Sensor detectou ${valorTemperatura.toFixed(1)}°C no ambiente.`,
                            dataLabel, dataHoraCompleta, hora, timestamp: ts,
                            isAlert: true,
                            iconName: 'thermometer-outline',
                            iconBg: tempBg, iconColor: tempColor, textColor: tempColor
                        });
                    } else if (valorTemperatura < limiteTemperaturaMin) {
                        novosAlertasLocais.push({
                            id: `alerta_temp_baixa_${ts}`,
                            titulo: 'Temperatura Baixa',
                            descricao: `Sensor detectou ${valorTemperatura.toFixed(1)}°C no ambiente.`,
                            dataLabel, dataHoraCompleta, hora, timestamp: ts,
                            isAlert: true,
                            iconName: 'thermometer-outline',
                            iconBg: tempBg, iconColor: tempColor, textColor: tempColor
                        });
                    }
                }

                // Analisa e cria Alerta de Umidade 
                if (valorUmidade !== null) {
                    if (valorUmidade > limiteUmidadeMax) {
                        novosAlertasLocais.push({
                            id: `alerta_umid_alta_${ts}`,
                            titulo: 'Umidade Alta',
                            descricao: `Sensor detectou ${valorUmidade.toFixed(0)}% de umidade.`,
                            dataLabel, dataHoraCompleta, hora, timestamp: ts,
                            isAlert: true,
                            iconName: 'water-outline',
                            iconBg: umidBg, iconColor: umidColor, textColor: umidColor
                        });
                    } else if (valorUmidade < limiteUmidadeMin) {
                        novosAlertasLocais.push({
                            id: `alerta_umid_baixa_${ts}`,
                            titulo: 'Umidade Baixa',
                            descricao: `Sensor detectou ${valorUmidade.toFixed(0)}% de umidade.`,
                            dataLabel, dataHoraCompleta, hora, timestamp: ts,
                            isAlert: true,
                            iconName: 'water-outline',
                            iconBg: umidBg, iconColor: umidColor, textColor: umidColor
                        });
                    }
                }
            });

            setEventos(novosAlertasLocais);
            setLeituras(novasLeiturasNormais);
        } catch (error) {
            console.error("Erro inesperado ao processar dados de alertas e leituras:", error);
        } finally {
            setLoading(false);
        }
    }

    async function limparTudo() {
        try {
            setLoading(true);
            await limparHistoricoGeral();
            setEventos([]);
            setLeituras([]);
        } catch (error) {
            console.error("Erro ao limpar histórico:", error);
            Alert.alert("Erro", "Não foi possível limpar o histórico.");
        } finally {
            setLoading(false);
        }
    }

    function confirmarLimpeza() {
        // Evita requisições à API caso o histórico já esteja vazio.
        if (eventos.length === 0 && leituras.length === 0) {
            if (Platform.OS === 'web') {
                window.alert("Não há registros de leituras ou alertas para apagar.");
            } else {
                Alert.alert("Aviso", "Não há registros de leituras ou alertas para apagar.");
            }
            return;
        }

        // Fallback para Web: A API Alert.alert causa travamento em navegadores, utilizando window.confirm como alternativa.
        if (Platform.OS === 'web') {
            if (window.confirm("Tem certeza que deseja limpar todo o histórico de alertas e leituras? Esta ação não pode ser desfeita.")) {
                limparTudo();
            }
        } else {
            Alert.alert(
                "Limpar Histórico",
                "Tem certeza que deseja limpar todo o histórico de alertas e leituras? Esta ação não pode ser desfeita.",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Limpar", style: "destructive", onPress: limparTudo }
                ]
            );
        }
    }

    // Se o filtro for Alertas exibe os eventos dinâmicos. Senão, exibe leituras puras.
    const listaExibicao = filtroAtivo === 'Alertas' ? eventos : leituras;

    const datasUnicas = [...new Set(listaExibicao.map((e) => e.dataLabel))];

    const secoes = datasUnicas.map((label) => ({
        title: label,
        data: listaExibicao.filter((e) => e.dataLabel === label),
    }));

    const renderCard = (item: EventoHistorico) => {
        // Se NÃO for um alerta, renderiza o card original para a aba de Leituras
        if (!item.isAlert) {
            return (
                <View key={item.id} style={styles.eventCard}>
                    <View style={[GLOBAL_STYLES.lateralBar, { backgroundColor: item.barColor || COLORS.primary }]} />
                    <View style={[GLOBAL_STYLES.row, { flex: 1, paddingVertical: SPACING.md, paddingHorizontal: SPACING.md }]}>
                        <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                            <Text style={[styles.eventTitle, { marginBottom: SPACING.xs }]} numberOfLines={1}>
                                {item.titulo}
                            </Text>
                            {item.descricao ? (
                                <Text style={[styles.eventDescription, { marginBottom: SPACING.sm }]} numberOfLines={4}>
                                    {item.descricao}
                                </Text>
                            ) : null}
                        </View>
                        <Text style={[styles.eventTime, { textAlign: 'right' }]}>
                            {item.dataHoraCompleta.replace(' ', '\n')}
                        </Text>
                    </View>
                </View>
            );
        }

        // Se FOR um alerta
        return (
            <View key={item.id} style={styles.eventCard}>
                <View style={[GLOBAL_STYLES.lateralBar, { backgroundColor: item.iconColor }]} />

                <View style={[GLOBAL_STYLES.row, { flex: 1, paddingVertical: SPACING.md, paddingHorizontal: SPACING.md }]}>
                    <View style={[GLOBAL_STYLES.centerContent, {
                        width: 48,
                        height: 48,
                        borderRadius: BORDER_RADIUS.md,
                        backgroundColor: item.iconBg,
                        marginRight: SPACING.md
                    }]}>
                        <Ionicons name={item.iconName} size={26} color={item.iconColor} />
                    </View>

                    <View style={[GLOBAL_STYLES.row, { flex: 1 }]}>
                        <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                            <Text style={[styles.eventTitle, { color: item.textColor, marginBottom: SPACING.xs }]} numberOfLines={1}>
                                {item.titulo}
                            </Text>
                            {item.descricao ? (
                                <Text style={[styles.eventDescription, { marginBottom: SPACING.sm }]} numberOfLines={2}>
                                    {item.descricao}
                                </Text>
                            ) : null}
                        </View>
                        <Text style={[styles.eventTime, { textAlign: 'right' }]}>
                            {item.dataHoraCompleta.replace(' ', '\n')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Alertas</Text>
            </View>
            {/* Filtros */}
            <View style={[styles.filterContainer, GLOBAL_STYLES.spaceBetween]}>
                <View style={[GLOBAL_STYLES.row, { gap: SPACING.sm }]}>
                    {(['Leituras', 'Alertas'] as const).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterButton,
                                filtroAtivo === f && styles.filterButtonActive,
                            ]}
                            onPress={() => setFiltroAtivo(f)}
                        >
                            <Text style={[
                                styles.filterText,
                                filtroAtivo === f && styles.filterTextActive,
                            ]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={confirmarLimpeza} style={{ paddingVertical: SPACING.xs }}>
                    <Text style={{ color: COLORS.error, fontSize: TYPOGRAPHY.size.sm, fontWeight: 'bold' }}>Apagar Histórico</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de alertas */}
            <SectionList
                style={styles.list}
                showsVerticalScrollIndicator={false}
                sections={loading || listaExibicao.length === 0 ? [] : secoes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderCard(item)}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.secaoLabel}>{title.toUpperCase()}</Text>
                )}
                ListEmptyComponent={
                    loading ? (
                        <View style={[GLOBAL_STYLES.centerContent, { padding: SPACING.xxl }]}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.sm }]}>
                                Carregando alertas...
                            </Text>
                        </View>
                    ) : (
                        <View style={GLOBAL_STYLES.emptyState}>
                            <Ionicons name="checkmark-circle" size={60} color={COLORS.success} />
                            <Text style={styles.emptyStateTitle}>Sem {filtroAtivo.toLowerCase()}!</Text>
                            <Text style={styles.emptyStateSubtitle}>Tudo está funcionando perfeitamente.</Text>
                        </View>
                    )
                }
                ListFooterComponent={<View style={{ height: SPACING.xxxl || 32 }} />}
            />
        </SafeAreaView>
    );
};

export default AlertasScreen;
