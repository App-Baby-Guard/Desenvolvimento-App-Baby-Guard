import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, GLOBAL_STYLES } from '../../shared/styles/globalStyles';

type EventoTipo = 'temperatura' | 'umidade' | 'movimento' | 'choro' | 'sistema' | 'conexao';

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

// TODO: Substituir dados mockados pelos recebidos da API (endpoint de eventos/alertas)
const EVENTOS: EventoHistorico[] = [
    {
        id: 1, tipo: 'temperatura', iconName: 'thermometer',
        iconColor: '#E53935', iconBg: '#FFEBEE', barColor: '#E53935',
        titulo: 'Temperatura alta — Quarto da Sofia',
        descricao: '28°C — acima do limite configurado.',
        hora: '14:45', dataLabel: 'Hoje', resolvido: false,
    },
    {
        id: 2, tipo: 'umidade', iconName: 'water',
        iconColor: '#F59E0B', iconBg: '#FFFBEB', barColor: '#F59E0B',
        titulo: 'Umidade baixa — Quarto da Sofia',
        descricao: 'Caiu abaixo de 40%.',
        hora: '14:12', dataLabel: 'Hoje', resolvido: false,
    },
    {
        id: 3, tipo: 'choro', iconName: 'happy',
        iconColor: '#E53935', iconBg: '#FFEBEE', barColor: '#E53935',
        titulo: 'Choro detectado',
        descricao: 'Áudio acima do limite para alertar o cuidador.',
        hora: '10:15', dataLabel: 'Hoje', resolvido: true,
    },
    {
        id: 4, tipo: 'sistema', iconName: 'moon',
        iconColor: '#5C6BC0', iconBg: '#EDE7F6', barColor: '#5C6BC0',
        titulo: 'Modo noturno ativado',
        descricao: 'As luzes indicadoras do robô foram apagadas.',
        hora: '20:30', dataLabel: 'Ontem', resolvido: true,
    },
    {
        id: 5, tipo: 'conexao', iconName: 'wifi',
        iconColor: '#2E7D32', iconBg: '#E8F5E9', barColor: '#2E7D32',
        titulo: 'Conexão restaurada — Sala',
        descricao: 'O robô está online novamente.',
        hora: '18:05', dataLabel: 'Ontem', resolvido: true,
    },
    {
        id: 6, tipo: 'sistema', iconName: 'settings',
        iconColor: '#0288D1', iconBg: '#E1F5FE', barColor: '#0288D1',
        titulo: 'Atualização de Sistema',
        descricao: 'Versão 1.4.0 instalada com sucesso.',
        hora: '09:00', dataLabel: 'Ontem', resolvido: true,
    },
    {
        id: 7, tipo: 'temperatura', iconName: 'thermometer',
        iconColor: '#E53935', iconBg: '#FFEBEE', barColor: '#E53935',
        titulo: 'Temperatura alta — Quarto da Sofia',
        descricao: '29°C detectado durante a tarde.',
        hora: '15:20', dataLabel: '17/05/2026', resolvido: true,
    },
    {
        id: 8, tipo: 'movimento', iconName: 'walk',
        iconColor: '#1565C0', iconBg: '#E3F2FD', barColor: '#1565C0',
        titulo: 'Movimento detectado',
        descricao: 'Atividade identificada próximo ao berço.',
        hora: '08:45', dataLabel: '17/05/2026', resolvido: true,
    },
];

const AlertasScreen: React.FC = () => {
    const [filtroAtivo, setFiltroAtivo] = useState<'Leituras' | 'Alertas'>('Alertas');

    // TODO: Implementar lógica de filtro baseada em API quando integrada
    const eventosFiltrados = EVENTOS.filter((e) => {
        if (filtroAtivo === 'Alertas')
            return !e.resolvido;
        if (filtroAtivo === 'Leituras')
            return true;
        return true;
    });

    const datasUnicas = [...new Set(eventosFiltrados.map((e) => e.dataLabel))];

    const renderCard = (item: EventoHistorico) => (
        <View key={item.id} style={[GLOBAL_STYLES.eventCard, !item.resolvido && GLOBAL_STYLES.eventCardUnresolved]}>
            <View style={[GLOBAL_STYLES.lateralBar, { backgroundColor: item.barColor }]} />
            <View style={[GLOBAL_STYLES.iconCircle, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.iconName as any} size={20} color={item.iconColor} />
            </View>
            <View style={{ flex: 1, paddingVertical: SPACING.md, paddingRight: SPACING.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <Text style={[GLOBAL_STYLES.eventTitle, item.resolvido && GLOBAL_STYLES.eventTitleRead]} numberOfLines={1}>
                        {item.titulo}
                    </Text>
                    <Text style={GLOBAL_STYLES.eventTime}>{item.hora}</Text>
                </View>
                <Text style={[GLOBAL_STYLES.eventDescription, item.resolvido && GLOBAL_STYLES.eventDescriptionRead]} numberOfLines={2}>
                    {item.descricao}
                </Text>
                {!item.resolvido && (
                    <View style={GLOBAL_STYLES.badgeUnresolved}>
                        <Text style={GLOBAL_STYLES.badgeUnresolvedText}>Não resolvido</Text>
                    </View>
                )}
            </View>
            <Ionicons name="chevron-forward" size={14} color="#CCCCCC" style={{ paddingHorizontal: SPACING.md }} />
        </View>
    );

    return (
        <SafeAreaView style={GLOBAL_STYLES.screen}>
            <View style={GLOBAL_STYLES.header}>
                <Text style={GLOBAL_STYLES.title}>Alertas</Text>
                <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
            </View>
            <View style={GLOBAL_STYLES.filterContainer}>
                {(['Leituras', 'Alertas'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[GLOBAL_STYLES.filterButton, filtroAtivo === f && GLOBAL_STYLES.filterButtonActive]}
                        onPress={() => setFiltroAtivo(f)}
                    >
                        <Text style={[GLOBAL_STYLES.filterText, filtroAtivo === f && GLOBAL_STYLES.filterTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <ScrollView style={GLOBAL_STYLES.list} showsVerticalScrollIndicator={false}>
                {eventosFiltrados.length === 0 ? (
                    <View style={GLOBAL_STYLES.emptyState}>
                        <Ionicons name="checkmark-circle" size={60} color={COLORS.success} />
                        <Text style={GLOBAL_STYLES.emptyStateTitle}>Sem {filtroAtivo.toLowerCase()}!</Text>
                        <Text style={GLOBAL_STYLES.emptyStateSubtitle}>Tudo está funcionando perfeitamente.</Text>
                    </View>
                ) : (
                    datasUnicas.map((label) => {
                        const grupo = eventosFiltrados.filter((e) => e.dataLabel === label);
                        return (
                            <View key={label}>
                                <Text style={GLOBAL_STYLES.secaoLabel}>{label.toUpperCase()}</Text>
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
