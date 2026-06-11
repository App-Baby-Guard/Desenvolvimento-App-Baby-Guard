![Logo do Projeto](frontend/src/assets/imagemBG.png)
# BabyGuard — Monitoramento Inteligente de Berços IoT

O **BabyGuard** é um sistema de monitoramento para berços infantis integrado a sensores físicos de telemetria de temperatura, umidade, luminosidade e distância (presença). O projeto é estruturado em uma arquitetura distribuída composta por firmware embarcado (ESP32), barramento de comunicação (Blynk Cloud), API de backend (Node.js/Express com PostgreSQL) e aplicativo móvel (React Native/Expo com SQLite para cache offline).

---

## Arquitetura do Sistema

```
[ ESP32 Simulador (Wokwi) ] 
       │ (Wi-Fi / TCP)
       ▼
[ Blynk IoT Cloud ] (Mantém cache dos pinos virtuais V3, V4, V5, V6, V7)
       ▲
       │ (HTTP REST / Axios Polling 60s)
[ Backend API (Node.js/TypeScript) ] <=======> [ Banco PostgreSQL (Supabase) ]
       ▲
       │ (HTTP REST / Fetch Polling 60s)
[ Aplicativo Móvel (React Native/Expo) ] <===> [ Banco SQLite Local ] + [ AsyncStorage ]
```

### Componentes de Hardware Simulados (Pinos Blynk)
* **V3**: Sensor de Temperatura (°C)
* **V4**: Sensor de Umidade (%)
* **V5**: Sensor de Luminosidade (Lux)
* **V6**: Sensor de Distância Ultrassônico (cm) — Mapeado localmente e remotamente como flag booleana de movimentação quando a leitura for inferior a 50cm.
* **V7**: Pino de Estado Standby ("1" = Ativo/Monitorando; "0" = Standby/Pausado).

---

## Tecnologias Reais Utilizadas

### Aplicativo Mobile (React Native / Expo)
* **Estrutura**: React Native com Expo SDK 54 e TypeScript.
* **Estilização**: CSS-in-JS e biblioteca de componentes React Native Paper.
* **Persistência Local**: Banco de dados relacional SQLite local via `expo-sqlite` (para cache offline) e armazenamento chave-valor rápido `AsyncStorage` (para sessões JWT e temas).
* **Navegação**: Roteador estruturado com Native Stack e Bottom Tabs da biblioteca React Navigation.
* **Gráficos**: Plotagem do histórico de temperatura via `react-native-chart-kit`.
* **Recursos Nativos**: Acesso físico à Câmera e Galeria de Mídia do celular (`expo-image-picker`) com solicitação de permissões dinâmicas em tempo real.

### API de Backend (Node.js / Express)
* **Ambiente**: Runtime Node.js com TypeScript e execução dev via `ts-node-dev`.
* **Banco de Dados**: Pool de conexões assíncronas PostgreSQL via driver nativo `pg`.
* **Segurança**: Hashing de senhas com biblioteca `bcryptjs` de complexidade 10, autenticação JWT via `jsonwebtoken` e middleware de token blacklist para logout seguro.

---

## Funcionalidades Principais do Aplicativo
1. **Pareamento de Berços (Claim Device)**: Vincula um código físico único (UUID) de um hardware BabyGuard à conta autenticada do usuário.
2. **Painel de Controle em Tempo Real (Dashboard)**: Exibe leituras de sensores ambientais através de cartões interativos animados e mostra um gráfico de oscilação térmica da temperatura local.
3. **Detecção Dinâmica de Standby**: Polling rápido diretamente do Blynk Cloud (de 5 em 5 segundos) detecta se o aparelho físico está em standby (pino V7 = 0) desativando o monitoramento visual do app.
4. **Histórico e Alarmes Dinâmicos**: A tela de Alertas lista o histórico agrupado de sensores e aponta desvios térmicos ou de umidade baseando-se em limites reguláveis pelo próprio usuário na aba Ajustes.
5. **Arquitetura Offline-First**: O app salva o histórico de alertas e leituras em banco local SQLite. Ao detectar ausência de rede (offline), o app executa fallbacks de SELECT locais de forma silenciosa para não quebrar a usabilidade do usuário.
6. **Alternância de Temas**: Suporte global a temas Claro e Escuro (Dark Mode) persistidos localmente.
7. **Foto de Perfil**: Permite tirar foto da Câmera ou buscar da Galeria, encodando o arquivo de mídia em Base64 para envio seguro à API de perfil do usuário.

---

## Estrutura do Projeto

```
BabyGuard
├── backend
│   ├── dist (código compilado)
│   ├── src
│   │   ├── config (database.ts)
│   │   ├── controllers (auth, blynk, dispositivos, eventos, leituras, sensores, usuarios)
│   │   ├── middleware (autenticacao, tokenBlacklist)
│   │   ├── models (interfaces TypeScript)
│   │   ├── routes (definições de rotas HTTP)
│   │   ├── services (regras de negócio e queries ao banco pg/Blynk)
│   │   ├── types (index.ts)
│   │   ├── utils (respostas, validacao)
│   │   ├── app.ts (configuração express)
│   │   └── server.ts (entrada do servidor)
│   └── package.json
└── frontend
    ├── src
    │   ├── config (apiUrl.ts)
    │   ├── context (AuthContext, ThemeContext)
    │   ├── controllers (roboController.ts)
    │   ├── database (sqlite.ts, migrations/schema.ts)
    │   ├── hooks (useLogin, usePerfil)
    │   ├── models (interfaces locais)
    │   ├── repositories (Dispositivo, Evento, Leitura, Sensor, SensorLimits)
    │   ├── routes (RootNavigator, TabNavigator)
    │   ├── services (api, auth, blynk, dispositivos, eventos, leituras, sensores)
    │   ├── shared (styles, utils/logger)
    │   ├── styles (folhas de estilo CSS-in-JS)
    │   ├── tests (Jest tests)
    │   └── views (components, screens)
    └── package.json
```

---

## Processo de Instalação e Execução

### Pré-requisitos
* Node.js (v18+) instalado.
* Banco de dados PostgreSQL rodando ou instância Supabase ativa.
* Aplicativo Expo Go instalado no smartphone físico (para rodar o app móvel).

### Passo 1: Configuração das Variáveis de Ambiente (`.env`)

No diretório `backend/` crie um arquivo `.env` contendo:
```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host:seu_port/seu_banco?sslmode=require
JWT_SECRET=sua_chave_secreta_jwt
```

No diretório `frontend/` crie um arquivo `.env` contendo:
```env
EXPO_PUBLIC_API_URL=http://<IP_LOCAL_DO_COMPUTADOR>:3000
EXPO_PUBLIC_BLYNK_TOKEN=seu_blynk_auth_token_de_teste
EXPO_PUBLIC_BLYNK_BASE_URL=https://blynk.cloud/external/api
```

### Passo 2: Executando o Backend
Abra o terminal na pasta `backend/` e execute:
```bash
npm install
npm run dev
```
O servidor será inicializado na porta `3000`. O worker de sincronização com o Blynk Cloud iniciará a rotina automática de 60 segundos.

### Passo 3: Executando o Aplicativo Móvel (Expo)
Abra o terminal na pasta `frontend/` e execute:
```bash
npm install
npx expo start
```
Escaneie o QR Code exibido no terminal utilizando a câmera do celular (iOS) ou o aplicativo Expo Go (Android).

---

## Rotas e Endpoints Principais da API

### Autenticação (Pública)
* `POST /auth/registro` -> Cria nova conta de usuário.
* `POST /auth/login` -> Valida credenciais e retorna token JWT + dispositivos do usuário.

### Dispositivos (Privada - Requer Header `Authorization: Bearer <token>`)
* `GET /dispositivos` -> Lista robôs ativos cadastrados na conta.
* `POST /dispositivos` -> Associa/pareia um UUID físico de fábrica à conta autenticada.
* `PATCH /dispositivos/:uuid` -> Renomeia ou altera o status de conexão de um dispositivo.
* `DELETE /dispositivos/:uuid` -> Remove o vínculo de um dispositivo da conta do usuário.

### Leituras e Eventos (Privada)
* `GET /leituras` -> Histórico geral de dados agregados por minuto.
* `GET /leituras/dispositivo/:id` -> Últimas leituras lidas em cada sensor do robô.
* `DELETE /leituras/limpar/todos` -> Limpa todo o histórico de sensores atrelados ao usuário.
* `GET /eventos` -> Lista alertas gerados pelos sensores associados à conta.
* `DELETE /eventos/limpar/todos` -> Limpa todo o histórico de alertas do usuário logado.

---

## Integrantes do Grupo
* **Joyce Masalla Jorge**
* **Arthur Steiner Morais Silva**
* **Sânio Rodrigues Silva Trindade**
* **Arthur Lourenço Fritz**

---

## Licença
Este projeto acadêmico é protegido sob a licença **ISC**.