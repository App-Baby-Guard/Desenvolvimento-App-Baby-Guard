import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
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
import { buscarEventos, limparHistoricoGeral } from '../../services/leiturasService';

type EventoTipo = 'temperatura' | 'umidade' | 'movimento' | 'choro' | 'sistema' | 'conexao' | 'luminosidade';

interface EventoHistorico {
    id: number;
    tipo: EventoTipo;
    iconName: string;
    iconColor: string;
    iconBg: string;
    barColor: string;
    titulo: string;
    descricao: string;
    hora: string;
    dataLabel: string;
    resolvido: boolean;
}

// ─── Mapear evento da API para o formato visual ─────────────────────
function mapearEvento(evento: any): EventoHistorico {
    const tipo_evento: string = evento.tipo_evento || "";
    const nivel: string = evento.nivel_criticidade || "baixo";
    const data = new Date(evento.data_evento);

    // Determinar tipo visual
    let tipo: EventoTipo = "sistema";
    let iconName = "settings";
    let iconColor = "#0288D1";
    let iconBg = "#E1F5FE";
    let barColor = "#0288D1";
    let descricao = tipo_evento;

    if (tipo_evento.toLowerCase().includes("temperatura")) {
        tipo = "temperatura";
        iconName = "thermometer";
        iconColor = "#E53935";
        iconBg = "#FFEBEE";
        barColor = "#E53935";
        descricao = "Valor acima do limite configurado.";
    } else if (tipo_evento.toLowerCase().includes("umidade")) {
        tipo = "umidade";
        iconName = "water";
        iconColor = "#F59E0B";
        iconBg = "#FFFBEB";
        barColor = "#F59E0B";
        descricao = "Caiu abaixo do limite seguro.";
    } else if (tipo_evento.toLowerCase().includes("luminosidade")) {
        tipo = "luminosidade";
        iconName = "sunny";
        iconColor = "#F59E0B";
        iconBg = "#FFFBEB";
        barColor = "#F59E0B";
        descricao = "Ambiente muito claro para o bebê.";
    } else if (tipo_evento.toLowerCase().includes("movimento")) {
        tipo = "movimento";
        iconName = "walk";
        iconColor = "#1565C0";
        iconBg = "#E3F2FD";
        barColor = "#1565C0";
        descricao = "Atividade identificada próximo ao berço.";
    } else if (tipo_evento.toLowerCase().includes("choro")) {
        tipo = "choro";
        iconName = "happy";
        iconColor = "#E53935";
        iconBg = "#FFEBEE";
        barColor = "#E53935";
        descricao = "Áudio acima do limite para alertar o cuidador.";
    } else if (tipo_evento.toLowerCase().includes("conexão") || tipo_evento.toLowerCase().includes("conexao")) {
        tipo = "conexao";
        iconName = "wifi";
        iconColor = "#2E7D32";
        iconBg = "#E8F5E9";
        barColor = "#2E7D32";
    }

    // Formatar hora
    const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    // Formatar data label
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    let dataLabel: string;
    if (data.toDateString() === hoje.toDateString()) {
        dataLabel = "Hoje";
    } else if (data.toDateString() === ontem.toDateString()) {
        dataLabel = "Ontem";
    } else {
        dataLabel = data.toLocaleDateString("pt-BR");
    }

    // Criticidade alta/critico = não resolvido
    const resolvido = nivel === "baixo";

    return {
        id: evento.id_evento,
        tipo,
        iconName,
        iconColor,
        iconBg,
        barColor,
        titulo: tipo_evento,
        descricao,
        hora,
        dataLabel,
        resolvido,
    };
}

const AlertasScreen: React.FC = () => {
    const isFocused = useIsFocused();
    const [filtroAtivo, setFiltroAtivo] = useState<'Leituras' | 'Alertas'>('Alertas');
    const { isDarkMode } = useTheme();
    const styles = getStyles(isDarkMode);
    
    // [REMOÇÃO DE MOCKS]
    // A lista fixa com as informações falsas de alertas que ficava aqui foi removida,
    // pois agora estamos integrando a lógica oficial da robótica puxando direto da API.
    const [eventos, setEventos] = useState<EventoHistorico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            carregarEventos();
        }
    }, [isFocused]);

    async function carregarEventos() {
        try {
            setLoading(true);
            const dados = await buscarEventos();
            const eventosFormatados = dados.map(mapearEvento);
            setEventos(eventosFormatados);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        } finally {
            setLoading(false);
        }
    }

    async function limparTudo() {
        try {
            setLoading(true);
            await limparHistoricoGeral();
            setEventos([]);
        } catch (error) {
            console.error("Erro ao limpar histórico:", error);
            Alert.alert("Erro", "Não foi possível limpar o histórico.");
        } finally {
            setLoading(false);
        }
    }

    function confirmarLimpeza() {
        // [UX - REGRA DE NEGÓCIO]
        // Eu implementei essa trava para que, se o usuário clicar em apagar e a lista já estiver vazia, não façamos uma requisição inútil para a API.
        // Em vez disso, eu exibo apenas um aviso visual (UX amigável).
        if (eventos.length === 0) {
            if (Platform.OS === 'web') {
                window.alert("Não há registros de leituras ou alertas para apagar.");
            } else {
                Alert.alert("Aviso", "Não há registros de leituras ou alertas para apagar.");
            }
            return;
        }

        // [COMPATIBILIDADE MULTIPLATAFORMA]
        // Assim como eu fiz na exclusão do robô, notei que o 'Alert' trava na web.
        // Por isso, eu adicionei essa verificação do Platform.OS para usar o window.confirm 
        // e garantir que o app funcione perfeitamente nos navegadores de desktop.
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

    const eventosFiltrados = eventos.filter((e) => {
        if (filtroAtivo === 'Alertas')
            return !e.resolvido;
        if (filtroAtivo === 'Leituras')
            return true;
        if (filtroAtivo === 'Leituras')
            return true;
        return true;
    });

    const datasUnicas = [...new Set(eventosFiltrados.map((e) => e.dataLabel))];

    const renderCard = (item: EventoHistorico) => (
        <View key={item.id} style={[styles.eventCard, !item.resolvido && styles.eventCardUnresolved]}>
            <View style={[GLOBAL_STYLES.lateralBar, { backgroundColor: item.barColor }]} />
            <View style={[GLOBAL_STYLES.iconCircle, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.iconName as any} size={20} color={item.iconColor} />
            </View>
            <View style={{ flex: 1, paddingVertical: SPACING.md, paddingRight: SPACING.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <Text style={[styles.eventTitle, item.resolvido && styles.eventTitleRead]} numberOfLines={1}>
                        {item.titulo}
                    </Text>
                    <Text style={styles.eventTime}>{item.hora}</Text>
                </View>
                <Text style={[styles.eventDescription, item.resolvido && styles.eventDescriptionRead]} numberOfLines={2}>
                    {item.descricao}
                </Text>
                {!item.resolvido && (
                    <View style={GLOBAL_STYLES.badgeUnresolved}>
                        <Text style={GLOBAL_STYLES.badgeUnresolvedText}>Não resolvido</Text>
                    </View>
                )}
            </View>
            <Ionicons name="chevron-forward" size={14} color={styles.iconColor.color as string} style={{ paddingHorizontal: SPACING.md }} />
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
                    <Text style={{ color: "#E53935", fontSize: 13, fontWeight: 'bold' }}>Apagar Histórico</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de alertas */}
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={{ padding: SPACING.xxl, alignItems: "center" }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={[GLOBAL_STYLES.textMuted, { marginTop: SPACING.sm }]}>
                            Carregando alertas...
                        </Text>
                    </View>
                ) : eventosFiltrados.length === 0 ? (
                    <View style={GLOBAL_STYLES.emptyState}>
                        <Ionicons name="checkmark-circle" size={60} color={COLORS.success} />
                        <Text style={styles.emptyStateTitle}>Sem {filtroAtivo.toLowerCase()}!</Text>
                        <Text style={styles.emptyStateSubtitle}>Tudo está funcionando perfeitamente.</Text>
                    </View>
                ) : (
                    datasUnicas.map((label) => {
                        const grupo = eventosFiltrados.filter((e) => e.dataLabel === label);
                        return (
                            <View key={label}>
                                <Text style={styles.secaoLabel}>{label.toUpperCase()}</Text>
                                {grupo.map(renderCard)}
                            </View>
                        );
                    })
                )}
                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default AlertasScreen;
