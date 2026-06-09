import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, GLOBAL_STYLES } from '../../shared/styles/globalStyles';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from '../../styles/alertasStyles';
import { useIsFocused } from '@react-navigation/native';
import { buscarEventos, limparHistoricoGeral, buscarHistoricoLeituras } from '../../services/leiturasService';

type EventoTipo = 'temperatura' | 'umidade' | 'movimento' | 'choro' | 'sistema' | 'conexao' | 'luminosidade';

interface EventoHistorico {
    id: number;
    tipo: EventoTipo;
    barColor: string;
    titulo: string;
    descricao: string;
    hora: string;
    dataLabel: string;
    resolvido: boolean;
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

//  Mapear evento da API para o formato visual 
function mapearEvento(evento: any): EventoHistorico {
    const tipo_evento: string = evento.tipo_evento || "";
    const nivel: string = evento.nivel_criticidade || "baixo";
    
    // Padroniza a data para UTC antes de qualquer cálculo de UI
    const dataLocal = parseDataUTC(evento.data_evento);

    // Determinar tipo visual
    let tipo: EventoTipo = "sistema";
    let barColor = COLORS.primary;
    let descricao = tipo_evento;

    // Padrão de cores espelhado com a DashboardScreen para consistência visual
    if (tipo_evento.toLowerCase().includes("temperatura")) {
        tipo = "temperatura";
        barColor = "#FF6B6B";
        descricao = "Valor acima do limite configurado.";
    } else if (tipo_evento.toLowerCase().includes("umidade")) {
        tipo = "umidade";
        barColor = "#4ECDC4";
        descricao = "Caiu abaixo do limite seguro.";
    } else if (tipo_evento.toLowerCase().includes("luminosidade")) {
        tipo = "luminosidade";
        barColor = "#FFD93D";
        descricao = "Ambiente muito claro para o bebê.";
    } else if (tipo_evento.toLowerCase().includes("movimento")) {
        tipo = "movimento";
        barColor = "#A78BFA";
        descricao = "Atividade identificada próximo ao berço.";
    } else if (tipo_evento.toLowerCase().includes("choro")) {
        tipo = "choro";
        barColor = "#E53935";
        descricao = "Áudio acima do limite para alertar o cuidador.";
    } else if (tipo_evento.toLowerCase().includes("conexão") || tipo_evento.toLowerCase().includes("conexao")) {
        tipo = "conexao";
        barColor = COLORS.success;
    }

    // O JS do celular agora subtrai as horas automaticamente baseado no fuso do aparelho
    const hora = formatarHoraLocal(dataLocal);

    const dataLabel = formatarDataLabel(dataLocal);

    // Criticidade alta/critico = não resolvido
    const resolvido = nivel === "baixo";

    return {
        id: evento.id_evento,
        tipo,
        barColor,
        titulo: tipo_evento,
        descricao,
        hora,
        dataLabel,
        resolvido,
    };
}

//  Mapear leitura bruta da API para o formato visual esperado, colocando os sensores no mesmo card
function mapearLeitura(leitura: any): EventoHistorico {

    const dataLocal = parseDataUTC(leitura.data_hora);
    
    const hora = formatarHoraLocal(dataLocal);
    
    // Formata a descrição com base nos sensores disponíveis naquela leitura
    const temp = leitura.temperatura !== null && leitura.temperatura !== undefined ? `${Number(leitura.temperatura).toFixed(1)} °C` : '--';
    const umid = leitura.umidade !== null && leitura.umidade !== undefined ? `${Number(leitura.umidade).toFixed(0)} %` : '--';
    const luz = leitura.luminosidade !== null && leitura.luminosidade !== undefined ? `${Number(leitura.luminosidade).toFixed(0)} Lux` : '--';
    const mov = leitura.movimento === true ? "Detectado" : (leitura.movimento === false ? "Calmo" : "--");

    const descricao = `Temperatura: ${temp}\nUmidade: ${umid}\nLuminosidade: ${luz}\nMovimento: ${mov}`;
    const dataLabel = formatarDataLabel(dataLocal);

    return {
        id: dataLocal.getTime(), // Usa o timestamp (milissegundos) da leitura como um ID único, seguro e imutável
        tipo: "sistema",
        barColor: COLORS.primary,
        titulo: "Leitura do Ambiente",
        descricao,
        hora,
        dataLabel,
        resolvido: true, // Leituras não têm tag de "Não resolvido"
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
            
            // 1. TENTA BUSCAR DADOS DA INTERNET (API)
            const [dadosEventos, dadosLeituras] = await Promise.all([
                buscarEventos(),
                buscarHistoricoLeituras()
            ]);

            setEventos(dadosEventos.map(mapearEvento));
            // garantir que não tenha mais de 50 itens mapeados
            setLeituras(dadosLeituras.slice(0, 50).map((l: any) => mapearLeitura(l)));
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

    // Se o filtro for Alertas, pega o estado 'eventos' mostrando só os não resolvidos.
    // Se o filtro for Leituras, pega direto o estado 'leituras'.
    const listaExibicao = filtroAtivo === 'Alertas' ? eventos.filter(e => !e.resolvido) : leituras;

    const datasUnicas = [...new Set(listaExibicao.map((e) => e.dataLabel))];

    const secoes = datasUnicas.map((label) => ({
        title: label,
        data: listaExibicao.filter((e) => e.dataLabel === label),
    }));

    const renderCard = (item: EventoHistorico) => (
        <View key={item.id} style={[styles.eventCard, !item.resolvido && styles.eventCardUnresolved]}>
            <View style={[GLOBAL_STYLES.lateralBar, { backgroundColor: item.barColor }]} />

            <View style={{ flex: 1, paddingVertical: SPACING.md, paddingRight: SPACING.sm, paddingLeft: SPACING.md }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <Text style={[styles.eventTitle, item.resolvido && styles.eventTitleRead]} numberOfLines={1}>
                        {item.titulo}
                    </Text>
                    <Text style={styles.eventTime}>{item.hora}</Text>
                </View>
                <Text style={[styles.eventDescription, item.resolvido && styles.eventDescriptionRead]} numberOfLines={4}>
                    {item.descricao}
                </Text>
                {!item.resolvido && (
                    <View style={GLOBAL_STYLES.badgeUnresolved}>
                        <Text style={GLOBAL_STYLES.badgeUnresolvedText}>Não resolvido</Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Alertas</Text>
                <Ionicons name="notifications-outline" size={22} color={styles.iconColor.color as string} />
            </View>
            {/* Filtros */}
            <View style={[styles.filterContainer, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
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
                    <Text style={{ color: COLORS.error, fontSize: 13, fontWeight: 'bold' }}>Apagar Histórico</Text>
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
                        <View style={{ padding: SPACING.xxl, alignItems: "center" }}>
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
                ListFooterComponent={<View style={{ height: 32 }} />}
            />
        </SafeAreaView>
    );
};

export default AlertasScreen;
