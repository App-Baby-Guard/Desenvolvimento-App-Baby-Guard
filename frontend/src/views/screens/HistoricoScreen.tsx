import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../shared/styles/globalStyles';

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

const HISTORICO: EventoHistorico[] = [
  {
    id: 1,
    tipo: 'temperatura',
    iconName: 'thermometer',
    iconColor: '#E53935',
    iconBg: '#FFEBEE',
    barColor: '#E53935',
    titulo: 'Temperatura alta — Quarto da Sofia',
    descricao: '28°C — acima do limite configurado.',
    hora: '14:45',
    dataLabel: 'Hoje',
    resolvido: false,
  },
  {
    id: 2,
    tipo: 'umidade',
    iconName: 'water',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
    barColor: '#F59E0B',
    titulo: 'Umidade baixa — Quarto da Sofia',
    descricao: 'Caiu abaixo de 40%.',
    hora: '14:12',
    dataLabel: 'Hoje',
    resolvido: false,
  },
  {
    id: 3,
    tipo: 'choro',
    iconName: 'happy',
    iconColor: '#E53935',
    iconBg: '#FFEBEE',
    barColor: '#E53935',
    titulo: 'Choro detectado',
    descricao: 'Áudio acima do limite para alertar o cuidador.',
    hora: '10:15',
    dataLabel: 'Hoje',
    resolvido: true,
  },
  {
    id: 4,
    tipo: 'sistema',
    iconName: 'moon',
    iconColor: '#5C6BC0',
    iconBg: '#EDE7F6',
    barColor: '#5C6BC0',
    titulo: 'Modo noturno ativado',
    descricao: 'As luzes indicadoras do robô foram apagadas.',
    hora: '20:30',
    dataLabel: 'Ontem',
    resolvido: true,
  },
  {
    id: 5,
    tipo: 'conexao',
    iconName: 'wifi',
    iconColor: '#2E7D32',
    iconBg: '#E8F5E9',
    barColor: '#2E7D32',
    titulo: 'Conexão restaurada — Sala',
    descricao: 'O robô está online novamente.',
    hora: '18:05',
    dataLabel: 'Ontem',
    resolvido: true,
  },
  {
    id: 6,
    tipo: 'sistema',
    iconName: 'settings',
    iconColor: '#0288D1',
    iconBg: '#E1F5FE',
    barColor: '#0288D1',
    titulo: 'Atualização de Sistema',
    descricao: 'Versão 1.4.0 instalada com sucesso.',
    hora: '09:00',
    dataLabel: 'Ontem',
    resolvido: true,
  },
  {
    id: 7,
    tipo: 'temperatura',
    iconName: 'thermometer',
    iconColor: '#E53935',
    iconBg: '#FFEBEE',
    barColor: '#E53935',
    titulo: 'Temperatura alta — Quarto da Sofia',
    descricao: '29°C detectado durante a tarde.',
    hora: '15:20',
    dataLabel: '17/05/2026',
    resolvido: true,
  },
  {
    id: 8,
    tipo: 'movimento',
    iconName: 'walk',
    iconColor: '#1565C0',
    iconBg: '#E3F2FD',
    barColor: '#1565C0',
    titulo: 'Movimento detectado',
    descricao: 'Atividade identificada próximo ao berço.',
    hora: '08:45',
    dataLabel: '17/05/2026',
    resolvido: true,
  },
];

const HistoricoScreen: React.FC = () => {
  const [filtroAtivo, setFiltroAtivo] = useState<'Todos' | 'Alertas' | 'Sistema'>('Todos');

  const eventosFiltrados = HISTORICO.filter((e) => {
    if (filtroAtivo === 'Alertas')
      return ['temperatura', 'umidade', 'movimento', 'choro'].includes(e.tipo);
    if (filtroAtivo === 'Sistema')
      return ['sistema', 'conexao'].includes(e.tipo);
    return true;
  });

  const datasUnicas = [...new Set(eventosFiltrados.map((e) => e.dataLabel))];

  const renderCard = (item: EventoHistorico) => (
    <View key={item.id} style={[styles.card, !item.resolvido && styles.cardNaoResolvido]}>
      <View style={[styles.barraLateral, { backgroundColor: item.barColor }]} />

      <View style={[styles.iconeWrapper, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.iconName as any} size={20} color={item.iconColor} />
      </View>

      <View style={styles.conteudo}>
        <View style={styles.linhaTop}>
          <Text style={[styles.titulo, item.resolvido && styles.tituloLido]} numberOfLines={1}>
            {item.titulo}
          </Text>
          <Text style={styles.hora}>{item.hora}</Text>
        </View>

        <Text style={[styles.descricao, item.resolvido && styles.descricaoLida]} numberOfLines={2}>
          {item.descricao}
        </Text>

        {!item.resolvido && (
          <View style={styles.badgeNaoResolvido}>
            <Text style={styles.badgeTexto}>Não resolvido</Text>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={14} color="#CCCCCC" style={styles.seta} />
    </View>
  );

  return (
    <View style={styles.tela}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Histórico</Text>
        <Ionicons name="calendar-outline" size={22} color={COLORS.textSecondary} />
      </View>

      <View style={styles.filtrosContainer}>
        {(['Todos', 'Alertas', 'Sistema'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBotao, filtroAtivo === f && styles.filtroBotaoAtivo]}
            onPress={() => setFiltroAtivo(f)}
          >
            <Text style={[styles.filtroTexto, filtroAtivo === f && styles.filtroTextoAtivo]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        {eventosFiltrados.length === 0 ? (
          <View style={styles.vazio}>
            <Ionicons name="time-outline" size={60} color={COLORS.textTertiary} />
            <Text style={styles.vazioTitulo}>Nenhum registro encontrado</Text>
            <Text style={styles.vazioSubtitulo}>O histórico aparecerá aqui.</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitulo: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filtroBotao: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceSoft,
  },
  filtroBotaoAtivo: {
    backgroundColor: COLORS.primary,
  },
  filtroTexto: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },
  lista: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  secaoLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textTertiary,
    letterSpacing: 1,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardNaoResolvido: {
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  barraLateral: {
    width: 4,
    alignSelf: 'stretch',
  },
  iconeWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: SPACING.md,
    marginRight: SPACING.sm,
  },
  conteudo: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.sm,
  },
  linhaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  titulo: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  tituloLido: {
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  hora: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  descricao: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  descricaoLida: {
    color: COLORS.textTertiary,
  },
  badgeNaoResolvido: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEBEE',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: SPACING.xs,
  },
  badgeTexto: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    color: '#E53935',
  },
  seta: {
    paddingHorizontal: SPACING.md,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 80,
  },
  vazioTitulo: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  vazioSubtitulo: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default HistoricoScreen;