// // src/screens/AlertsScreen.tsx

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AlertCard from '../components/AlertCard';

// const AlertsScreen: React.FC = () => {
//   // Estado para armazenar os alertas
//   const [alerts, setAlerts] = useState([
//     {
//       id: 1,
//       iconName: 'thermometer' as const,
//       iconColor: '#FF6B6B',
//       title: 'Temperatura alta',
//       description: 'Sensor detectou 29°C na quarta',
//       time: '14:30',
//     },
//     {
//       id: 2,
//       iconName: 'walk' as const,
//       iconColor: '#4ECDC4',
//       title: 'Movimento detectado',
//       description: 'Atividade identificada à 12h ago',
//       time: '12:15',
//     },
//     {
//       id: 3,
//       iconName: 'water-outline' as const,
//       iconColor: '#4ECDC4',
//       title: 'Umidade baixa',
//       description: 'Umidade está em 30% - Recomenda-se ligar humidificador',
//       time: '10:45',
//     },
//     {
//       id: 4,
//       iconName: 'volume-high' as const,
//       iconColor: '#FFB347',
//       title: 'Choro detectado',
//       description: 'Áudio acima do limite para alertar o cuidador',
//       time: '10:15',
//     },
//     {
//       id: 5,
//       iconName: 'moon' as const,
//       iconColor: '#A78BFA',
//       title: 'Modo Noturno ativado',
//       description: 'O monitoramento de luz foi reduzido',
//       time: '07:10',
//     },
//     {
//       id: 6,
//       iconName: 'wifi-outline' as const,
//       iconColor: '#66BB6A',
//       title: 'Conexão restaurada',
//       description: 'A câmera reconectou com sucesso à rede',
//       time: '07:15',
//     },
//   ]);

//   // Estado para aba ativa
//   const [activeTab, setActiveTab] = useState('Todas');

//   // Função para remover um alerta
//   const handleDismissAlert = (alertId: number) => {
//     setAlerts(alerts.filter((alert) => alert.id !== alertId));
//   };

//   // Função para limpar todos os alertas
//   const handleClearAll = () => {
//     setAlerts([]);
//   };

//   return (
//     <View style={styles.container}>
//       {/* ========== HEADER ========== */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Alertas</Text>
//         <TouchableOpacity onPress={handleClearAll}>
//           <Text style={styles.headerButton}>Limpar</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ========== ABAS (SEM .map() - CADA BOTÃO EXPLÍCITO) ========== */}
//       <View style={styles.tabsContainer}>
//         {/* ABA 1: Todas */}
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'Todas' && styles.tabButtonActive,
//           ]}
//           onPress={() => setActiveTab('Todas')}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'Todas' && styles.tabTextActive,
//             ]}
//           >
//             Todas
//           </Text>
//         </TouchableOpacity>

//         {/* ABA 2: Críticos */}
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'Críticos' && styles.tabButtonActive,
//           ]}
//           onPress={() => setActiveTab('Críticos')}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'Críticos' && styles.tabTextActive,
//             ]}
//           >
//             Críticos
//           </Text>
//         </TouchableOpacity>

//         {/* ABA 3: Histórico */}
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'Histórico' && styles.tabButtonActive,
//           ]}
//           onPress={() => setActiveTab('Histórico')}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'Histórico' && styles.tabTextActive,
//             ]}
//           >
//             Histórico
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* ========== LISTA DE ALERTAS ========== */}
//       <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
//         {/* Verifica se há alertas para mostrar */}
//         {alerts.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
//             <Text style={styles.emptyStateText}>Sem alertas!</Text>
//             <Text style={styles.emptyStateSubtext}>
//               Tudo está funcionando perfeitamente.
//             </Text>
//           </View>
//         ) : (
//           // Renderiza cada alerta
//           <>
//             {alerts.map((alert) => (
//               <AlertCard
//                 key={alert.id}
//                 iconName={alert.iconName}
//                 iconColor={alert.iconColor}
//                 title={alert.title}
//                 description={alert.description}
//                 time={alert.time}
//                 onDismiss={() => handleDismissAlert(alert.id)}
//               />
//             ))}
//           </>
//         )}
//       </ScrollView>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // Container principal
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },

//   // ========== HEADER ==========
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//   },

//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1A1A1A',
//   },

//   headerButton: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0066FF',
//   },

//   // ========== ABAS ==========
//   tabsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#FFFFFF',
//     gap: 8,
//   },

//   // Botão de aba
//   tabButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 16,
//     backgroundColor: '#F0F0F0',
//   },

//   // Aba ativa
//   tabButtonActive: {
//     backgroundColor: '#0066FF',
//   },

//   // Texto de aba
//   tabText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#666666',
//   },

//   // Texto de aba ativa
//   tabTextActive: {
//     color: '#FFFFFF',
//   },

//   // ========== LISTA DE ALERTAS ==========
//   alertsList: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },

//   // ========== ESTADO VAZIO ==========
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 80,
//   },

//   emptyStateText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1A1A1A',
//     marginTop: 12,
//   },

//   emptyStateSubtext: {
//     fontSize: 12,
//     color: '#888888',
//     marginTop: 4,
//   },

//   // Espaço inferior
//   bottomSpacer: {
//     height: 20,
//   },
// });

// export default AlertsScreen;