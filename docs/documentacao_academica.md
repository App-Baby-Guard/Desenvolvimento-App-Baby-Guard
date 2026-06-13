# DOCUMENTAÇÃO ACADÊMICA E TÉCNICA OFICIAL — BABYGUARD

## CAPA

* **Nome do Projeto**: BabyGuard
* **Disciplina**: Programação para Dispositivos Móveis (PPDM)
* **Integrantes**:
  * Joyce Masalla Jorge
  * Arthur Steiner Morais Silva
  * Sânio Rodrigues Silva Trindade
  * Arthur Lourenço Fritz

---

## SUMÁRIO

1. Introdução
2. Objetivos
3. Problema Resolvido
4. Escopo do Projeto
5. Arquitetura Geral
6. Tecnologias Utilizadas
7. Bibliotecas e Dependências
8. Estrutura de Pastas
9. Arquitetura Mobile (MVVM + Repository)
10. Arquitetura Backend (Controller-Service-Repository)
11. Banco de Dados PostgreSQL (Nuvem)
12. Banco de Dados SQLite (Embarcado/Cache)
13. Estrutura Completa das Tabelas
14. Autenticação (JWT + Blacklist)
15. Controle de Sessão
16. Context API
17. Gerenciamento de Estado (useReducer / Flux)
18. Navegação (Bottom Tabs + Native Stack)
19. Recursos Nativos
20. Comunicação com Hardware
21. Integração com Blynk IoT
22. Fluxo de Sincronização (10s Polling / Sync)
23. Fluxo Offline e Cache de Dados
24. Telas do Aplicativo
25. Funcionalidades de Cada Tela
26. Fluxos de Interface do Usuário
27. Regras de Negócio e Travas de Segurança
28. Segurança Implementada
29. Tratamento de Erros e Resiliência
30. Boas Práticas e Arquitetura Limpa
31. Processo de Instalação
32. Processo de Execução
33. Ambiente de Desenvolvimento
34. Limitações Conhecidas
35. Conclusão
36. Referência Completa da API REST (30 Endpoints)

---

### 1. Introdução
O projeto BabyGuard consiste em um sistema de monitoramento para berços infantis integrado a sensores físicos de temperatura, umidade, luminosidade e distância (ultrassônico) para rastrear movimento. O sistema é composto por um hardware embarcado (ESP32 simulado via Wokwi), um serviço de nuvem intermediário (Blynk IoT Cloud), uma API REST de backend (Node.js/Express com banco PostgreSQL) e um aplicativo móvel (React Native/Expo com banco local SQLite e AsyncStorage).

### 2. Objetivos
* Mapear e persistir localmente as leituras ambientais e alertas do berço.
* Disponibilizar as informações em tempo real no aplicativo móvel.
* Garantir o funcionamento contínuo do aplicativo móvel de maneira offline através de cache local estruturado no banco SQLite.
* Fornecer controle de acesso autenticado (JWT) para os usuários no backend e no aplicativo.
* Oferecer uma rotina de standby (modo economia/pausa) controlada diretamente pelo aplicativo via comunicação com o hardware.

### 3. Problema Resolvido
A falta de acompanhamento em tempo real das condições de conforto térmico, luminosidade excessiva e atividade física (movimentação ou ausência do bebê no berço), bem como a instabilidade de rede que comumente inutiliza aplicativos puramente online. O BabyGuard soluciona essa interrupção aplicando uma arquitetura offline-first no aplicativo, permitindo a consulta do histórico mesmo sem conexão ativa à internet.

### 4. Escopo do Projeto
O escopo abrange o pareamento e renomeação de dispositivos de monitoramento (robôs), a visualização dos dados dos sensores em formato de cartões visuais com barras de progresso, um gráfico histórico das variações de temperatura local, o recebimento de alertas dinâmicos baseados em limites configuráveis do aplicativo, a edição de dados de perfil do usuário e a alternância global de tema claro/escuro.

### 5. Arquitetura Geral
O ecossistema é distribuído em quatro camadas:
1. **Embarcado (ESP32)**: Coleta dados físicos (Temperatura/Umidade com DHT11, Luminosidade com LDR digital, Distância com HC-SR04) e transmite ao Blynk via protocolo TCP/IP.
2. **Blynk Cloud**: Recebe e mantém em cache os valores dos pinos virtuais.
3. **Backend API**: Um servidor Node.js/TypeScript que consulta periodicamente (de 10 em 10 segundos) a API REST do Blynk, insere os dados no banco PostgreSQL e fornece endpoints REST para o aplicativo.
4. **Mobile App**: Consome a API do backend, gerencia sessões locais via AsyncStorage e armazena os dados localmente no SQLite.

---

### 6. Tecnologias Utilizadas
* **Mobile**: React Native, Expo SDK 54, TypeScript, React Navigation, React Native Paper.
* **Backend**: Node.js, Express, TypeScript, ts-node-dev, pg (PostgreSQL driver).
* **Bancos de Dados**: PostgreSQL 16 (nuvem/produção via Supabase) e SQLite 3 via `expo-sqlite` (banco local embarcado).
* **IoT/Hardware**: ESP32, sensores DHT11, HC-SR04, LDR, Blynk Cloud API, Simulador Wokwi.

---

### 7. Bibliotecas e Dependências (Ultra Completa)

Esta seção documenta individualmente cada biblioteca, framework e pacote utilizado no ecossistema do BabyGuard, mapeados diretamente dos manifestos do projeto.

#### 7.1 Dependências do Frontend (`frontend/package.json`)

* **`expo` (v54.0.35)**: Framework e plataforma principal para o desenvolvimento do aplicativo React Native. Gerencia a compilação, o ciclo de vida do app e a conexão com módulos nativos sem necessidade de código nativo direto.
* **`react` (v19.1.0)**: Biblioteca base de JavaScript para construção das interfaces do usuário estruturada em componentes.
* **`react-dom` (v19.1.0)**: Pacote utilizado no projeto para viabilizar a renderização de elementos React no navegador no ecossistema Expo Web.
* **`react-native` (v0.81.5)**: Framework que permite compilar componentes em elementos nativos de interface gráfica do Android e iOS.
* **`react-native-web` (v0.21.0)**: Permite rodar o código do aplicativo React Native diretamente no ambiente web, convertendo componentes móveis para HTML5 equivalente.
* **`typescript` (v5.9.2)**: Linguagem que adiciona tipagem estática opcional ao JavaScript, trazendo detecção de erros em tempo de compilação.
* **`@expo/vector-icons` (v15.0.3)**: Renderização e gerenciamento de ícones vetoriais nativos no aplicativo (como ícones `Ionicons` em abas de navegação, botões e cabeçalhos).
* **`@react-native-async-storage/async-storage` (v2.2.0)**: Armazenamento local persistente chave-valor do tipo não volátil, usado para guardar a sessão do usuário (token JWT e dados cadastrais básicos) e preferências visuais (preferência pelo modo escuro).
* **`@react-navigation/native` (v7.2.4)** e **`@react-navigation/bottom-tabs` (v7.16.0)**: Infraestrutura de roteamento e navegação do app, provendo a navegação inferior por abas (Início, Alertas, Robôs, Ajustes).
* **`@react-navigation/native-stack` (v7.15.0)**: Roteador de pilha (Stack) para navegar de forma transicional para telas secundárias fora do fluxo de abas (Login, Cadastro, Parear Robô, Renomear Robô, Detalhes, Perfil).
* **`expo-asset` (v12.0.13)**: Biblioteca utilizada para gerenciar e pré-carregar recursos estáticos como imagens e fontes locais na inicialização do aplicativo.
* **`expo-image-picker` (v17.0.11)**: Componente que solicita permissões de segurança do celular e gerencia o uso da Câmera nativa e da Galeria de Fotos do smartphone para captura e atualização da imagem de perfil.
* **`expo-sqlite` (v16.0.10)**: Driver assíncrono para o banco de dados embarcado SQLite 3, essencial para criar tabelas locais, executar migrações na inicialização do app e servir de cache físico para o funcionamento offline.
* **`react-native-chart-kit` (v6.12.3)**: Biblioteca para renderização do gráfico de variações históricas de temperatura ambiente na tela de Dashboard.
* **`react-native-svg` (v15.12.1)**: Renderizador de gráficos vetoriais nativos e dependência direta obrigatória do `react-native-chart-kit`.
* **`react-native-paper` (v5.15.3)**: Biblioteca de componentes visuais baseada na especificação do Material Design da Google, fornecendo inputs de texto formatados, botões com efeito cascata, switches e modais.
* **`react-native-safe-area-context` (v5.6.0)**: Garante que os elementos de layout sejam posicionados respeitando os recortes físicos da tela, como o entalhe superior da câmera (notch) e a barra de gestos inferior.
* **`react-native-screens` (v4.16.0)**: Pacote de otimização que renderiza telas nativamente de forma a economizar memória e processamento gráfico.
* **`react-native-toast-message` (v2.3.3)**: Módulo de alerta dinâmico para renderizar mensagens flutuantes (Toasts) amigáveis para feedbacks de ações na interface (sucesso, erro ou avisos).

#### 7.2 Dependências de Desenvolvimento do Frontend (DevDependencies)

* **`jest` (v30.4.2)**: Framework de execução de testes automatizados para verificar comportamentos e lógicas no frontend.
* **`jest-expo` (v56.0.4)**: Configuração e preset pré-definido pelo Expo para permitir rodar testes unitários em componentes que usam dependências exclusivas do Expo.
* **`@testing-library/react-native` (v14.0.0)**: Facilita testes de comportamento de componentes React Native baseados na perspectiva do usuário de forma declarativa.
* **`@types/jest` (v29.5.0)** e **`@types/react` (v19.1.0)**: Arquivos de definições e contratos de tipos para o TypeScript para suporte inteligente em IDEs nas bibliotecas correspondentes.

#### 7.3 Dependências do Backend (`backend/package.json`)

* **`express` (v4.21.2)**: Framework web HTTP minimalista e flexível para criação da API REST, gerenciamento de middlewares e roteamento do backend.
* **`axios` (v1.16.1)**: Cliente HTTP baseado em Promessas usado para comunicação com o Blynk IoT Cloud para leitura e escrita dos pinos virtuais.
* **`bcryptjs` (v3.0.3)**: Algoritmo de hash de senhas de via única adaptado do bcrypt, que aplica saltos de criptografia (padrão de complexidade de 10) nas senhas dos usuários.
* **`cors` (v2.8.5)**: Middleware utilizado para habilitar o compartilhamento de recursos de origem cruzada (CORS), permitindo requisições originadas do app React Native.
* **`dotenv` (v16.6.1)**: Módulo que carrega variáveis de ambiente de um arquivo `.env` para a propriedade global `process.env`.
* **`jsonwebtoken` (v9.0.3)**: Biblioteca para emissão, assinatura e verificação de chaves do padrão RFC 7519 (tokens JWT) utilizando criptografia HMAC-SHA256 para autorizar chamadas em endpoints protegidos.
* **`pg` (v8.13.1)**: Driver cliente PostgreSQL para conectar, executar consultas diretas parametrizadas e gerenciar o pool de conexões com o banco remoto Supabase.

#### 7.4 Dependências de Desenvolvimento do Backend (DevDependencies)

* **`typescript` (v5.7.2)**: Compilador do TypeScript para converter códigos tipados em JavaScript puro compatível com Node.js.
* **`ts-node` (v10.9.2)**: Permite executar scripts TypeScript diretamente sem a necessidade de compilação prévia explícita.
* **`ts-node-dev` (v2.0.0)**: Executa o servidor de desenvolvimento com recarregamento em tempo real (auto-reload) ao alterar qualquer arquivo de código do backend.
* **`@types/node` (v22.10.2)**, **`@types/express` (v4.17.21)**, **`@types/jsonwebtoken` (v9.0.10)**, **`@types/pg` (v8.11.10)**, **`@types/cors` (v2.8.17)**, **`@types/bcryptjs` (v2.4.6)** e **`@types/uuid` (v9.0.8)**: Definições de tipagem necessárias para que o compilador do TypeScript conheça os contratos de parâmetros e retornos das bibliotecas utilizadas.

---

### 8. Estrutura de Pastas

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
    │   ├── services (auth, blynk, dispositivos, eventos, leituras)
    │   ├── shared (styles, utils/logger)
    │   ├── styles (folhas de estilo CSS-in-JS)
    │   ├── tests (Jest tests)
    │   └── views (components, screens)
    └── package.json
```

---

### 9. Arquitetura Mobile (MVVM + Repository)
O aplicativo móvel segue o padrão de projeto MVVM (Model-View-ViewModel) desacoplado da camada de dados por meio do padrão Repository:
* **Views (Telas/Componentes)**: Componentes React Native funcionais responsáveis apenas por desenhar a interface gráfica com base nos estados.
* **Controllers / ViewModels**: Intermediam a lógica, controlando o fluxo e chamadas assíncronas do aplicativo (ex: `roboController.ts`).
* **Services**: Camada responsável por se comunicar com a API do backend, fazendo o tratamento de timeouts e gerando as exceções que ativam o modo offline.
* **Repositories**: Camada de persistência local que abstrai as consultas brutas SQL executadas no SQLite do dispositivo móvel do usuário.
* **Models**: Arquivos que definem os contratos estruturais e schemas de dados das tabelas locais.

### 10. Arquitetura Backend (Controller-Service-Repository)
O backend adota o modelo clássico em camadas:
* **Routes**: Direcionam as requisições HTTP para os respectivos controllers da aplicação.
* **Middlewares**: Interceptam as chamadas HTTP para realizar validações (como token JWT) ou limpezas de segurança.
* **Controllers**: Validam o formato dos payloads das requisições de entrada e formatam a resposta de saída da API no padrão JSON.
* **Services**: Concentram toda a lógica e regras de negócio e efetuam as chamadas no banco PostgreSQL remoto via SQL parametrizado.

---

### 11. Banco de Dados PostgreSQL (Nuvem)
O banco PostgreSQL hospeda centralizadamente todos os dados dos usuários e dispositivos. Ele é hospedado na nuvem (Supabase) e acessado pelo backend usando as credenciais definidas na variável de ambiente `DATABASE_URL` no arquivo `.env`.

### 12. Banco de Dados SQLite (Embarcado/Cache)
O banco de dados SQLite (`babyguard.db`) roda localmente no dispositivo móvel do usuário por meio do driver assíncrono `expo-sqlite`. Ele é inicializado no arquivo [sqlite.ts](../frontend/src/database/sqlite.ts) e configurado na inicialização do aplicativo em [App.tsx](../frontend/src/App.tsx).

---

### 13. Estrutura Completa das Tabelas

#### PostgreSQL (Produção/Nuvem)

1. **usuarios**
   * `id_usuario` (SERIAL, PRIMARY KEY)
   * `nome` (VARCHAR)
   * `email` (VARCHAR, UNIQUE)
   * `senha_hash` (VARCHAR)
   * `telefone` (VARCHAR, NULLABLE)
   * `foto_perfil` (TEXT, NULLABLE)
   * `push_token` (VARCHAR, NULLABLE)
   * `status_usuario` (VARCHAR, DEFAULT 'ativo')
   * `criado_em` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

2. **dispositivos**
   * `id_dispositivo` (SERIAL, PRIMARY KEY)
   * `uuid_dispositivo` (VARCHAR, UNIQUE)
   * `id_usuario` (INTEGER, FOREIGN KEY REFERENCES usuarios)
   * `nome_dispositivo` (VARCHAR)
   * `wifi_ssid` (VARCHAR, NULLABLE)
   * `token_dispositivo` (VARCHAR, NULLABLE)
   * `status_dispositivo` (VARCHAR, DEFAULT 'offline')
   * `movimento` (BOOLEAN, DEFAULT FALSE)
   * `ativo` (BOOLEAN, DEFAULT TRUE)
   * `criado_em` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

3. **sensores**
   * `id_sensor` (SERIAL, PRIMARY KEY)
   * `id_dispositivo` (INTEGER, FOREIGN KEY REFERENCES dispositivos)
   * `nome_sensor` (VARCHAR)
   * `tipo_sensor` (VARCHAR)
   * `unidade_medida` (VARCHAR, NULLABLE)
   * `descricao` (VARCHAR, NULLABLE)

4. **leituras**
   * `id_leitura` (SERIAL, PRIMARY KEY)
   * `id_sensor` (INTEGER, FOREIGN KEY REFERENCES sensores)
   * `valor` (NUMERIC, NULLABLE)
   * `valor_booleano` (BOOLEAN, NULLABLE)
   * `movimento` (BOOLEAN, NULLABLE)
   * `data_hora` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

5. **eventos**
   * `id_evento` (SERIAL, PRIMARY KEY)
   * `id_dispositivo` (INTEGER, FOREIGN KEY REFERENCES dispositivos)
   * `id_sensor` (INTEGER, FOREIGN KEY REFERENCES sensores, NULLABLE)
   * `tipo_evento` (VARCHAR)
   * `nivel_criticidade` (VARCHAR)
   * `data_evento` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

6. **tokens_revogados**
   * `token` (TEXT, PRIMARY KEY)
   * `revogado_em` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

#### SQLite (Embarcado/Local)

As definições constam no arquivo [schema.ts](../frontend/src/database/migrations/schema.ts):

1. **dispositivos**
   * `id_dispositivo` (INTEGER, PRIMARY KEY AUTOINCREMENT)
   * `uuid_dispositivo` (TEXT, UNIQUE, NOT NULL)
   * `id_usuario` (INTEGER)
   * `nome_dispositivo` (TEXT, NOT NULL)
   * `status_dispositivo` (TEXT, DEFAULT 'offline')
   * `ativo` (INTEGER, DEFAULT 1)
   * `criado_em` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
   * `atualizado_em` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

2. **sensores**
   * `id_sensor` (INTEGER, PRIMARY KEY AUTOINCREMENT)
   * `id_dispositivo` (INTEGER, NOT NULL, FOREIGN KEY REFERENCES dispositivos)
   * `nome_sensor` (TEXT, NOT NULL)
   * `tipo_sensor` (TEXT, NOT NULL)
   * `unidade_medida` (TEXT)
   * `criado_em` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

3. **limites_sensores**
   * `id_limite` (INTEGER, PRIMARY KEY AUTOINCREMENT)
   * `label` (TEXT, UNIQUE, NOT NULL)
   * `tipo_sensor` (TEXT, NOT NULL)
   * `min` (REAL, NOT NULL)
   * `max` (REAL, NOT NULL)
   * `unidade_medida` (TEXT)
   * `atualizado_em` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

4. **leituras**
   * `id_leitura` (INTEGER, PRIMARY KEY AUTOINCREMENT)
   * `id_sensor` (INTEGER, NOT NULL, FOREIGN KEY REFERENCES sensores)
   * `valor` (REAL)
   * `valor_booleano` (INTEGER)
   * `movimento` (INTEGER)
   * `data_hora` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
   * `sincronizado` (INTEGER, DEFAULT 0)

5. **eventos**
   * `id_evento` (INTEGER, PRIMARY KEY AUTOINCREMENT)
   * `id_dispositivo` (INTEGER, NOT NULL, FOREIGN KEY REFERENCES dispositivos)
   * `id_sensor` (INTEGER, FOREIGN KEY REFERENCES sensores, NULLABLE)
   * `tipo_evento` (TEXT, NOT NULL)
   * `nivel_criticidade` (TEXT, DEFAULT 'normal')
   * `data_evento` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
   * `sincronizado` (INTEGER, DEFAULT 0)

#### Modelo Relacional Textual
```
[usuarios] 1 ------ 0..N [dispositivos]
[dispositivos] 1 -- 0..N [sensores]
[dispositivos] 1 -- 0..N [eventos]
[sensores] 1 ------ 0..N [leituras]
[sensores] 0..1 --- 0..N [eventos]
```

---

### 14. Autenticação (JWT + Blacklist)
A autenticação do sistema é realizada via token JWT (JSON Web Token).
* O backend gera o token na rota `/auth/login` ou `/auth/registro` contendo o `id_usuario` e o `email` com expiração padrão.
* O token é transmitido no cabeçalho HTTP da requisição: `Authorization: Bearer <token>`.
* O middleware `autenticacao.ts` no backend intercepta as rotas protegidas e valida a assinatura do token.
* Ao deslogar (`POST /auth/logout`), o token é armazenado na tabela PostgreSQL `tokens_revogados` (blacklist) para impedir sua reutilização posterior antes de expirar.

### 15. Controle de Sessão
No aplicativo móvel, a sessão do usuário é gerenciada localmente por meio do `AsyncStorage`.
* Ao logar/registrar, as funções persistirão o token sob a chave `'token'` e o objeto do usuário na chave `'usuario'`.
* Ao iniciar o aplicativo, o `AuthContext` lê estas chaves para determinar se direciona o fluxo para a tela de Login ou de Dashboard.
* Ao clicar em "Sair da Conta", as chaves `'token'` e `'usuario'` são excluídas do `AsyncStorage` localmente e o token é enviado para revogação no backend.

---

### 16. Context API
O aplicativo móvel implementa dois contextos globais:

#### AuthContext
* **Estado**: `token` (string | null), `usuario` (DadosUsuario | null), `estaLogado` (boolean), `carregandoSessao` (boolean).
* **Métodos**:
  * `salvarSessao(token, usuario)`: Persiste dados do login/cadastro no `AsyncStorage` e atualiza estados.
  * `limparSessao()`: Remove chaves do `AsyncStorage` e limpa estados.
  * `atualizarUsuario(usuario)`: Atualiza os dados de perfil no contexto e no storage.
* **Telas Consumidoras**: `RootNavigator`, `LoginScreen`, `RegisterScreen`, `PerfilScreen`, `ConfiguracoesScreen`, `DashboardScreen`.

#### ThemeContext
* **Estado**: `isDarkMode` (boolean).
* **Métodos**:
  * `toggleDarkMode(value)`: Altera o estado do tema e persiste a preferência no `AsyncStorage` com a chave `@babyguard:darkMode`.
* **Telas Consumidoras**: `AppContent` (App.tsx), `TabNavigator`, e todas as telas e componentes estilizados para detecção de cores dinâmicas.

---

### 17. Gerenciamento de Estado (useReducer / Flux)
Para a tela principal de monitoramento ([DashboardScreen.tsx](../frontend/src/views/screens/DashboardScreen.tsx)), o aplicativo implementa o hook `useReducer` do React para orquestrar estados complexos sob a arquitetura Flux:
* **Estado**:
  * `dispositivos`: Lista de robôs pertencentes ao usuário.
  * `dispositivoAtivo`: Robô selecionado para monitoramento atual.
  * `leituras`: Valores atuais dos sensores do robô selecionado.
  * `historicoLeituras`: Histórico das últimas 50 leituras agrupadas para o gráfico.
  * `loading`: Flag indicadora de requisições pendentes.
  * `isDeviceOn`: Flag que identifica se o dispositivo físico está ligado (modo ativo) ou desligado (standby).
* **Ações**: `START_LOADING`, `SET_DISPOSITIVOS`, `SELECT_DISPOSITIVO`, `SET_LEITURAS`, `SET_DEVICE_STATUS`, `STOP_LOADING`.

---

### 18. Navegação (Bottom Tabs + Native Stack)
A navegação é estruturada utilizando a biblioteca React Navigation com navegação híbrida Bottom Tabs e Native Stack:

```
Navegação do Aplicativo (RootNavigator Stack)
├── Login (LoginScreen) [Rota Pública / Inicial se não logado]
├── Register (RegisterScreen) [Rota Pública]
├── Tabs (TabNavigator BottomTabs) [Rota Privada / Inicial se logado]
│    ├── Início (DashboardScreen)
│    ├── Alertas (AlertasScreen)
│    ├── Robôs (MeusRobosScreen)
│    └── Ajustes (ConfiguracoesScreen)
├── NovoRobo (NovoRoboScreen) [Rota Privada]
├── RenomearRobo (RenomearRoboScreen) [Rota Privada, Params: id, nome]
├── RoboDetalhes (RoboDetalhesScreen) [Rota Privada, Params: id, nome, local?]
└── Perfil (PerfilScreen) [Rota Privada]
```

---

### 19. Recursos Nativos
O aplicativo móvel consome os recursos nativos do celular através do Expo SDK:
1. **Câmera**: Acionada via `ImagePicker.launchCameraAsync` em `PerfilScreen.tsx` para capturar fotos em tempo real.
2. **Acesso à Galeria**: Acionado via `ImagePicker.launchImageLibraryAsync` em `PerfilScreen.tsx` para selecionar imagens salvas.
3. **Armazenamento Local**: Acesso físico para persistência local pelo SQLite e AsyncStorage.
4. **Permissões de Câmera/Galeria**: Solicitadas explicitamente pelos métodos `ImagePicker.requestCameraPermissionsAsync()` e `ImagePicker.requestMediaLibraryPermissionsAsync()` antes do uso dos recursos nativos.

---

### 20. Comunicação com Hardware
A comunicação com o sistema embarcado (ESP32) é indireta e atravessa a internet pública.
1. O ESP32 realiza medições locais físicas e envia os valores para o servidor do Blynk Cloud via protocolo proprietário TCP do Blynk.
2. O backend da API interage com o Blynk Cloud por meio de requisições HTTP REST (Axios) para ler e escrever dados nos pinos virtuais.
3. O aplicativo móvel faz requisições HTTP REST (fetch) para a API do backend para recuperar o histórico e envia chamadas de controle (como standby) diretamente para a API pública do Blynk Cloud.

### 21. Integração com Blynk IoT
A integração com a plataforma Blynk IoT Cloud é configurada pelos seguintes pinos virtuais:
* **V0, V1, V2**: Controle manual dos canais R, B e G do LED RGB.
* **V3**: Temperatura (graus Celsius) capturada pelo sensor DHT11.
* **V4**: Umidade (porcentagem) capturada pelo sensor DHT11.
* **V5**: Luminosidade (0 = escuro, 1 = claro) capturada pelo sensor de luminosidade digital (LDR).
* **V6**: Distância do sensor ultrassônico (centímetros) — mapeada no banco de dados local e remoto como flag booleana de movimentação quando a leitura for menor que 50,0 cm.
* **V7**: Estado de Standby do dispositivo ("1" = Dispositivo monitorando/ativo; "0" = Standby/pausado).

---

### 22. Fluxo de Sincronização (10s Polling / Sync)
O sincronismo de dados é orquestrado em duas frentes:
1. **Ciclo Backend <-> Blynk**: O worker em `blynkSyncService.ts` possui um loop automático via `setTimeout` recursivo que roda a cada **10 segundos** buscando dados ativos no Blynk. Se o hardware estiver online e o pino V7 for "1", ele grava as leituras no banco PostgreSQL para manter o histórico centralizado.
2. **Ciclo Mobile <-> Backend (Dashboard)**: O aplicativo móvel executa requisições de leituras e histórico ao backend a cada **10 segundos** (sincronizado com o worker). Além disso, roda um ciclo mais rápido de **5 segundos** para buscar o pino V7 diretamente no Blynk Cloud, detectando e refletindo a entrada em Standby de forma quase imediata na interface móvel.

### 23. Fluxo Offline e Cache de Dados
Quando o aplicativo móvel perde a conexão com a internet:
1. As funções de busca HTTP em `leiturasService.ts` e `eventosService.ts` falham devido a erro de rede.
2. A cláusula `catch` captura a exceção de rede e redireciona o fluxo para o fallback offline.
3. O fallback offline executa uma query direta de SELECT no SQLite local do aparelho móvel, filtrando o histórico local cadastrado anteriormente.
4. Os dados são convertidos e renderizados na interface gráfica, permitindo que a Dashboard e a lista de Alertas continuem operacionais e legíveis de forma offline.

---

### 24. Telas do Aplicativo & 25. Funcionalidades de Cada Tela

#### Capturas de Tela Reais do Aplicativo (Screenshots)
Para ilustrar a interface gráfica (UI) real e a experiência de usuário (UX) do aplicativo BabyGuard em execução física, seguem as capturas de tela das principais telas do app:

##### 1. Dashboard de Monitoramento (Aba Início)
Exibe as leituras físicas em tempo real recebidas do hardware (temperatura, umidade, luminosidade e presença) com banners dinâmicos de avisos ("Umidade baixa detectada").

![Dashboard Real](images/real_dashboard.png)
*Figura 1: Tela Real do Dashboard de Monitoramento*

##### 2. Histórico de Leituras Ambientais (Aba Alertas - Leituras)
Exibe a listagem do cache local SQLite com as leituras ambientais minuto a minuto capturadas pelo sistema.

![Histórico de Leituras Real](images/real_alertas_leituras.png)
*Figura 2: Tela Real do Histórico de Leituras do SQLite*

##### 3. Histórico de Alertas de Ocorrências (Aba Alertas - Alertas)
Exibe a listagem de desvios e alarmes calculados pelo app (temperatura baixa, umidade baixa, movimento detectado) com ícones e status de criticidade.

![Histórico de Alertas Real](images/real_alertas_ocorrencias.png)
*Figura 3: Tela Real do Histórico de Ocorrências do SQLite*

##### 4. Gerenciamento de Dispositivos (Aba Robôs)
Exibe os berços inteligentes pareados à conta, com botões para renomear, buscar detalhes ou excluir, além de status dinâmico Online/Offline e Claim Device ("Configurar agora").

![Gerenciamento de Robôs Real](images/real_meus_robos.png)
*Figura 4: Tela Real do Gerenciamento de Robôs*

##### 5. Preferências e Ajustes (Aba Ajustes)
Exibe as opções de habilitar alertas, sons, ativar Tema Escuro global do aplicativo e ajustar limites de sensores ideais (temperatura e umidade).

![Ajustes Real](images/real_configuracoes.png)
*Figura 5: Tela Real de Preferências e Limites dos Sensores*

---

#### Tabela Detalhada das Telas e Funcionalidades

| Nome da Tela | Arquivo | Objetivo | Funcionalidades | APIs consumidas | Contextos | Hooks | Componentes | Permissões | Banco Local | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** | [LoginScreen.tsx](../frontend/src/views/screens/LoginScreen.tsx) | Acesso do usuário | Validação, login de usuários, alternar visibilidade de senha, link para cadastro. | `POST /auth/login` | `AuthContext` | `useLogin`, `useAuth` | View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Ionicons | Nenhuma | AsyncStorage | Atendido |
| **Cadastro** | [RegisterScreen.tsx](../frontend/src/views/screens/RegisterScreen.tsx) | Registro de contas | Criação de novos usuários com validação. | `POST /auth/registro` | `AuthContext` | `useAuth` | View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Ionicons | Nenhuma | AsyncStorage | Atendido |
| **Dashboard** | [DashboardScreen.tsx](../frontend/src/views/screens/DashboardScreen.tsx) | Monitoramento ambiental | Cartões de sensores, polling de 5s do standby, polling de 10s das leituras, gráfico de temperatura. | `GET /dispositivos`, `GET /leituras/dispositivo/:id`, `GET /leituras`, `GET /external/api/get` (Blynk V7) | `AuthContext`, `ThemeContext` | `useNavigation`, `useIsFocused`, `useTheme`, `useReducer`, `useAuth` | ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Image, LineChart, SensorCard, Ionicons | Nenhuma | SQLite e AsyncStorage | Atendido |
| **Alertas** | [AlertasScreen.tsx](../frontend/src/views/screens/AlertasScreen.tsx) | Histórico de alertas | Filtro de leituras e alertas, cálculo dinâmico de alarmes baseados nos limites, apagar histórico. | `GET /leituras`, `DELETE /eventos/limpar/todos`, `DELETE /leituras/limpar/todos` | `ThemeContext` | `useTheme`, `useIsFocused` | SectionList, View, Text, TouchableOpacity, ActivityIndicator, Ionicons | Nenhuma | SQLite e AsyncStorage | Atendido |
| **Meus Robôs** | [MeusRobosScreen.tsx](../frontend/src/views/screens/MeusRobosScreen.tsx) | Gerenciar dispositivos | Listagem de robôs associados à conta, busca textual, botão para remover robô. | `GET /dispositivos`, `DELETE /dispositivos/:uuid` | `ThemeContext` | `useNavigation`, `useIsFocused`, `useTheme` | FlatList, TextInput, View, Text, TouchableOpacity, ActivityIndicator, Ionicons | Nenhuma | SQLite e AsyncStorage | Atendido |
| **Novo Robô** | [NovoRoboScreen.tsx](../frontend/src/views/screens/NovoRoboScreen.tsx) | Parear novo berço | Formulário de pareamento usando UUID e nome customizado do robô. | `POST /dispositivos` | `ThemeContext` | `useNavigation`, `useTheme` | View, Text, TextInput, TouchableOpacity, ActivityIndicator, Ionicons | Nenhuma | SQLite e AsyncStorage | Atendido |
| **Renomear Robô** | [RenomearRoboScreen.tsx](../frontend/src/views/screens/RenomearRoboScreen.tsx) | Editar nome do berço | Alterar o apelido do dispositivo e sincronizar as modificações com a nuvem. | `PATCH /dispositivos/:uuid` | `ThemeContext` | `useNavigation`, `useRoute`, `useTheme` | View, Text, TextInput, TouchableOpacity, ActivityIndicator | Nenhuma | SQLite e AsyncStorage | Atendido |
| **Robô Detalhes** | [RoboDetalhesScreen.tsx](../frontend/src/views/screens/RoboDetalhesScreen.tsx) | Visualizar dados do berço | Exibe UUID, status online/offline do robô e botões para renomear, ver leituras ou excluir. | `GET /dispositivos`, `DELETE /dispositivos/:uuid` | `ThemeContext` | `useNavigation`, `useRoute`, `useTheme` | View, Text, TouchableOpacity, ActivityIndicator, Ionicons | Nenhuma | SQLite e AsyncStorage | Atendido |
| **Perfil** | [PerfilScreen.tsx](../frontend/src/views/screens/PerfilScreen.tsx) | Editar conta de usuário | Edição de Nome e Telefone, upload de foto Base64 tirada da Câmera ou Galeria, alterar senha. | `PATCH /usuarios/:id` | `AuthContext`, `ThemeContext` | `useTheme`, `useAuth`, `usePerfil` | ScrollView, View, Text, TextInput, TouchableOpacity, Image, Modal, ActivityIndicator, Ionicons | Câmera, Galeria | AsyncStorage | Atendido |
| **Configurações** | [ConfiguracoesScreen.tsx](../frontend/src/views/screens/ConfiguracoesScreen.tsx) | Preferências do aplicativo | Switch liga/desliga standby do hardware, alternar tema escuro, editar limites ideais, logout. | `GET /external/api/get` (Blynk V7), `GET /external/api/update` (Blynk V7), `POST /auth/logout` | `AuthContext`, `ThemeContext` | `useAuth`, `useTheme` | ScrollView, View, Text, TouchableOpacity, Switch, Image, Modal, TextInput, Ionicons | Nenhuma | SQLite e AsyncStorage | Atendido |

---

### 26. Fluxos de Interface do Usuário
* **Fluxo de Pareamento**: Usuário abre a aba "Robôs" -> Clica no botão "+" ou "Configurar agora" -> Insere o UUID e define um nome amigável -> Clica em "Conectar Robô". A API vincula o UUID ao usuário logado, e o registro é inserido localmente no SQLite.
* **Fluxo de Monitoramento**: Usuário abre a Dashboard. O app consulta o status de standby no Blynk via polling de 5 segundos. Caso esteja ativo, realiza polling de 10s no banco via API, renderiza as barras de progresso, atualiza os dados em tempo real e armazena os valores no SQLite local.
* **Fluxo de Perda de Conexão**: O aplicativo falha ao se comunicar com a API do backend, captura o erro de rede, emite um aviso silencioso e consome as leituras e alertas armazenados localmente no SQLite para renderização em tempo real das abas Início e Alertas.

### 27. Regras de Negócio e Travas de Segurança
* **Conversão de Presença (HC-SR04)**: A leitura física da distância do sensor é convertida em boolean de movimento. Valores inferiores a 50cm caracterizam presença ou agitação no berço e disparam a flag de movimento ativa.
* **Ativação e Standby (V7)**: O interruptor no app envia o comando de Standby (V7 = 0) para o Blynk Cloud. Ao ler V7 = 0, o backend marca o dispositivo como 'offline' e interrompe a gravação das leituras no banco. O app móvel detecta o standby em tempo real e exibe banners, ocultando o gráfico.
* **Isolamento de Contas**: Os eventos e dispositivos são filtrados estritamente pelo `id_usuario` obtido a partir da validação do token JWT do usuário autenticado no backend.
* **Pareamento Único (Claim Device)**: O robô só pode ser pareado se o seu UUID físico constar de fábrica na base PostgreSQL. Se outra conta tentar vincular um robô já associado, a API retorna erro de conflito `409`.
* **Trava de Controle de Standby**: Se um usuário não tiver nenhum robô cadastrado na conta, a tela de configurações desabilita (bloqueia) a interação com o interruptor do Standby e renderiza em vermelho a mensagem: "Cadastre um dispositivo para utilizar esta função."

### 28. Segurança Implementada
* **Tokens JWT**: Criptografados com assinatura HMAC-SHA256, contendo tempo de expiração curto para evitar vazamentos de credenciais.
* **Blacklist de Tokens**: Logout efetivo que insere o token do usuário em uma tabela local do Postgres para bloqueio imediato caso o mesmo token tente ser reutilizado.
* **Hashing de Senhas**: Algoritmo de hash criptográfico `bcryptjs` de via única com 10 rounds de salt.
* **SQL Injection Prevention**: Utilização rigorosa de parâmetros nomeados/posicionais (`$1`, `$2` no Postgres client, e `?` no expo-sqlite).

### 29. Tratamento de Erros e Resiliência
* **Backend**: Middleware global que intercepta erros no Express e padroniza a saída em formato JSON no formato `{ sucesso: false, mensagem: "..." }` com códigos HTTP apropriados.
* **Frontend**: Cláusulas `try/catch` envolvendo APIs de permissões de Câmera/Galeria e requisições para evitar que erros de rede ou de hardware quebrem e finalizem abruptamente (crash) o aplicativo React Native.

### 30. Boas Práticas e Arquitetura Limpa
* **Clean Code**: Divisão clara de responsabilidades no mobile e backend utilizando conceitos sólidos de MVC/MVVM.
* **Código Rígido e Tipado**: Uso extensivo de TypeScript no frontend e backend para garantir integridade e diminuir erros humanos em tempo de execução.
* **Otimização de Renderização**: Utilização de `useCallback` e `useMemo` em listagens de histórico do SQLite (`AlertasScreen`) para evitar gargalos de renderização desnecessários.

---

### 31. Processo de Instalação

#### Backend
1. Navegue até a pasta `backend/`.
2. Execute o comando para instalar as dependências:
   ```bash
   npm install
   ```

#### Frontend
1. Navegue até a pasta `frontend/`.
2. Execute o comando para instalar as dependências:
   ```bash
   npm install
   ```

### 32. Processo de Execução

#### Inicializando o Banco de Dados PostgreSQL
Execute as tabelas remotas no Supabase/PGAdmin conforme a seção 13 (PostgreSQL).

#### Configuração das Variáveis de Ambiente (`.env`)
No diretório `backend/.env`:
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco?sslmode=require
JWT_SECRET=sua_chave_secreta_jwt
```
No diretório `frontend/.env`:
```env
EXPO_PUBLIC_API_URL=http://<IP_DO_SEU_COMPUTADOR>:3000
EXPO_PUBLIC_BLYNK_TOKEN=seu_blynk_auth_token
EXPO_PUBLIC_BLYNK_BASE_URL=https://blynk.cloud/external/api
```

#### Executando o Servidor de Backend
No diretório `backend/`:
```bash
npm run dev
```

#### Executando o Aplicativo Móvel (Expo)
No diretório `frontend/`:
```bash
npx expo start
```
* Use a tecla `a` para abrir no emulador Android, ou escaneie o QR Code no aparelho físico via Expo Go.

### 33. Ambiente de Desenvolvimento
* **OS**: Windows / macOS / Linux
* **Node.js**: v18 ou superior.
* **Expo Go**: v54 instalado no celular para validação local.
* **Wokwi**: Para simulação física da placa ESP32 enviando telemetria.

### 34. Limitações Conhecidas
* **Dependência Blynk**: Se os servidores do Blynk Cloud ficarem lentos, o tempo de resposta do dashboard do aplicativo móvel ou do worker do backend será afetado.
* **Limites de Polling**: O polling de 10 segundos impede o monitoramento em tempo real instantâneo (sub-segundo) na base de dados de histórico remoto, de modo que variações rápidos só aparecem na tela do Blynk, mas não no histórico do aplicativo.
* **Fallback Local Estático**: O SQLite local do aplicativo móvel só recebe cache ao abrir e ler as telas sob conexão de internet. Caso o app seja aberto pela primeira vez sem nenhuma conexão prévia, o SQLite estará vazio.

### 35. Conclusão
O BabyGuard atende a todos os critérios e requisitos exigidos no regulamento da 2ª etapa de PPDM. A integração de persistência dupla (AsyncStorage para chave-valor rápida e SQLite para cache estruturado local) garante que o aplicativo funcione perfeitamente de forma offline, e a modularização baseada em clean code simplifica manutenções futuras.

---

### 36. Referência Completa da API REST (30 Endpoints)

Esta seção fornece os detalhes técnicos de todos os 30 endpoints REST expostos pela API backend do BabyGuard.

#### 36.1 Visão Geral
* **URL Base**: Definida em `frontend/src/config/apiUrl.ts`.
* **Autenticação**: Praticamente todos os endpoints protegidos exigem o cabeçalho HTTP:
  ```http
  Authorization: Bearer <seu_token_jwt>
  ```

---

#### 36.2 Endpoints Autenticados e Públicos

#### Grupo Raiz

##### 1. Status da API (Público)
* **Método**: `GET`
* **Caminho**: `/`
* **Descrição**: Verifica a atividade e disponibilidade do servidor de backend.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "API BabyGuard online"
  }
  ```

---

#### Grupo Autenticação (`/auth`)

##### 2. Registro de Usuário (Público)
* **Método**: `POST`
* **Caminho**: `/auth/registro`
* **Corpo da Requisição**:
  ```json
  {
    "nome": "Joyce Masalla",
    "email": "joyce@email.com",
    "password": "senhaSegura123",
    "telefone": "11999998888"
  }
  ```
* **Exemplo de Resposta (201 Created)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Usuário registrado com sucesso",
    "dados": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5...",
      "usuario": {
        "id_usuario": 1,
        "nome": "Joyce Masalla",
        "email": "joyce@email.com",
        "telefone": "11999998888",
        "foto_perfil": null,
        "criado_em": "2026-06-11T13:00:00Z"
      }
    }
  }
  ```
* **Erros**: `400 Bad Request` (validação), `409 Conflict` (email duplicado).

##### 3. Login de Usuário (Público)
* **Método**: `POST`
* **Caminho**: `/auth/login`
* **Corpo da Requisição**:
  ```json
  {
    "email": "joyce@email.com",
    "password": "senhaSegura123"
  }
  ```
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Login realizado com sucesso",
    "dados": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5...",
      "usuario": {
        "id_usuario": 1,
        "nome": "Joyce Masalla",
        "email": "joyce@email.com",
        "telefone": "11999998888",
        "foto_perfil": null
      },
      "dispositivos": []
    }
  }
  ```
* **Erros**: `401 Unauthorized` (credenciais inválidas).

##### 4. Logout / Revogação de Token (Protegido)
* **Método**: `POST`
* **Caminho**: `/auth/logout`
* **Descrição**: Adiciona o token JWT do cabeçalho da requisição à tabela de revogações (blacklist) no banco.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Logout realizado com sucesso"
  }
  ```

##### 5. Validar Token (Protegido)
* **Método**: `GET`
* **Caminho**: `/auth/validar`
* **Descrição**: Valida se o token JWT armazenado no celular do usuário é válido.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": {
      "token_valido": true,
      "usuario": { "id_usuario": 1, "nome": "Joyce Masalla" }
    }
  }
  ```

---

#### Grupo Blynk (`/blynk`)

##### 6. Testar Pinos do Blynk (Público)
* **Método**: `GET`
* **Caminho**: `/blynk/teste/:token`
* **Descrição**: Realiza requisição para a API do Blynk Cloud a fim de verificar se o hardware simulado está online.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": {
      "v3": "24.5",
      "v4": "55.2"
    }
  }
  ```
* **Erros**: `502 Bad Gateway` (falha na nuvem do Blynk).

---

#### Grupo Usuários (`/usuarios`)

##### 7. Listar Usuários (Protegido)
* **Método**: `GET`
* **Caminho**: `/usuarios`
* **Query Params**: `page` (página, default 1), `limit` (itens por página, default 10).
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": {
      "pagina": 1,
      "limite": 10,
      "quantidade": 1,
      "usuarios": [{ "id_usuario": 1, "nome": "Joyce Masalla" }]
    }
  }
  ```

##### 8. Buscar Usuário por ID (Protegido)
* **Método**: `GET`
* **Caminho**: `/usuarios/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_usuario": 1, "nome": "Joyce Masalla", "email": "joyce@email.com" }
  }
  ```

##### 9. Criar Usuário (Protegido)
* **Método**: `POST`
* **Caminho**: `/usuarios`
* **Corpo da Requisição**:
  ```json
  {
    "nome": "Arthur Fritz",
    "email": "fritz@email.com",
    "senha": "senhaCripto123"
  }
  ```
* **Exemplo de Resposta (201 Created)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_usuario": 2, "nome": "Arthur Fritz", "email": "fritz@email.com" }
  }
  ```

##### 10. Atualizar Usuário / Perfil (Protegido)
* **Método**: `PATCH`
* **Caminho**: `/usuarios/:id`
* **Corpo da Requisição**: (Todos os campos são opcionais. Permite atualizar foto de perfil em Base64).
  ```json
  {
    "nome": "Joyce Jorge",
    "telefone": "11988887777",
    "foto_perfil": "data:image/jpeg;base64,/9j/4AAQSk..."
  }
  ```
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_usuario": 1, "nome": "Joyce Jorge", "telefone": "11988887777" }
  }
  ```

##### 11. Deletar Usuário (Protegido)
* **Método**: `DELETE`
* **Caminho**: `/usuarios/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Usuário deletado com sucesso"
  }
  ```

---

#### Grupo Dispositivos (`/dispositivos`)

##### 12. Listar Dispositivos (Protegido)
* **Método**: `GET`
* **Caminho**: `/dispositivos`
* **Descrição**: Retorna apenas os berços/robôs atrelados ao usuário logado no token.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": [
      {
        "id_dispositivo": 5,
        "uuid_dispositivo": "bg-device-001",
        "nome_dispositivo": "Berço Principal",
        "status_dispositivo": "online"
      }
    ]
  }
  ```

##### 13. Parear Dispositivo / Claim Device (Protegido)
* **Método**: `POST`
* **Caminho**: `/dispositivos`
* **Corpo da Requisição**:
  ```json
  {
    "uuid_dispositivo": "bg-device-001",
    "nome_dispositivo": "Berço do Arthur"
  }
  ```
* **Exemplo de Resposta (201 Created)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_dispositivo": 5, "uuid_dispositivo": "bg-device-001", "nome_dispositivo": "Berço do Arthur" }
  }
  ```
* **Erros**: `404 Not Found` (UUID de hardware de fábrica inexistente), `409 Conflict` (dispositivo já pareado por outro usuário).

##### 14. Atualizar Dispositivo / Renomear (Protegido)
* **Método**: `PATCH`
* **Caminho**: `/dispositivos/:uuid`
* **Corpo da Requisição**:
  ```json
  {
    "nome_dispositivo": "Berço Quarto Novo",
    "status_dispositivo": "offline"
  }
  ```
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": { "uuid_dispositivo": "bg-device-001", "nome_dispositivo": "Berço Quarto Novo", "status_dispositivo": "offline" }
  }
  ```

##### 15. Remover/Desvincular Dispositivo (Protegido)
* **Método**: `DELETE`
* **Caminho**: `/dispositivos/:uuid`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Dispositivo removido com sucesso do banco de dados"
  }
  ```

---

#### Grupo Sensores (`/sensores`)

##### 16. Listar Sensores (Protegido)
* **Método**: `GET`
* **Caminho**: `/sensores`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": {
      "quantidade": 4,
      "sensores": [
        { "id_sensor": 1, "id_dispositivo": 5, "nome_sensor": "DHT11 - Temperatura", "tipo_sensor": "temperatura" }
      ]
    }
  }
  ```

##### 17. Buscar Sensor por ID (Protegido)
* **Método**: `GET`
* **Caminho**: `/sensores/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_sensor": 1, "tipo_sensor": "temperatura", "unidade_medida": "°C", "descricao": "Sensor DHT11" }
  }
  ```

##### 18. Criar Sensor (Protegido)
* **Método**: `POST`
* **Caminho**: `/sensores`
* **Corpo da Requisição**:
  ```json
  {
    "id_dispositivo": 5,
    "nome_sensor": "LDR - Luminosidade",
    "tipo_sensor": "luminosidade",
    "unidade_medida": "Lux"
  }
  ```
* **Exemplo de Resposta (201 Created)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_sensor": 3, "nome_sensor": "LDR - Luminosidade", "tipo_sensor": "luminosidade" }
  }
  ```

##### 19. Deletar Sensor (Protegido)
* **Método**: `DELETE`
* **Caminho**: `/sensores/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Sensor removido com sucesso"
  }
  ```

---

#### Grupo Leituras (`/leituras`)

##### 20. Listar Leituras (Protegido)
* **Método**: `GET`
* **Caminho**: `/leituras`
* **Descrição**: Histórico total de leituras ambientais minuto a minuto.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": {
      "quantidade": 1,
      "leituras": [{ "id_leitura": 120, "valor": 23.4, "data_hora": "2026-06-11T13:40:00Z" }]
    }
  }
  ```

##### 21. Últimas Leituras por Dispositivo (Protegido)
* **Método**: `GET`
* **Caminho**: `/leituras/dispositivo/:id_dispositivo`
* **Descrição**: Retorna o valor ativo mais recente de cada sensor atrelado a este robô.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": {
      "quantidade": 4,
      "leituras": [
        { "id_sensor": 1, "tipo_sensor": "temperatura", "valor": 24.2 },
        { "id_sensor": 2, "tipo_sensor": "umidade", "valor": 52.0 },
        { "id_sensor": 3, "tipo_sensor": "luminosidade", "valor": 120.0 },
        { "id_sensor": 4, "tipo_sensor": "presenca", "valor_booleano": false }
      ]
    }
  }
  ```

##### 22. Buscar Leitura por ID (Protegido)
* **Método**: `GET`
* **Caminho**: `/leituras/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_leitura": 120, "valor": 23.4, "data_hora": "2026-06-11T13:40:00Z" }
  }
  ```

##### 23. Cadastrar Leitura (Protegido)
* **Método**: `POST`
* **Caminho**: `/leituras`
* **Descrição**: Inserção de uma nova leitura individual (consumido pelo worker de sincronização do blynk).
* **Corpo da Requisição**:
  ```json
  {
    "id_sensor": 1,
    "valor": 24.5
  }
  ```
* **Exemplo de Resposta (201 Created)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_leitura": 121, "id_sensor": 1, "valor": 24.5 }
  }
  ```

##### 24. Limpar Todo Histórico de Leituras (Protegido)
* **Método**: `DELETE`
* **Caminho**: `/leituras/limpar/todos`
* **Descrição**: Deleta todo o histórico de leituras ambientais dos robôs do usuário autenticado no token.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Histórico de leituras limpo com sucesso..."
  }
  ```

##### 25. Deletar Leitura Individual (Protegido)
* **Método**: `DELETE`
* **Caminho**: `/leituras/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Leitura removida com sucesso"
  }
  ```

---

#### Grupo Eventos (`/eventos`)

##### 26. Listar Eventos do Usuário (Protegido)
* **Método**: `GET`
* **Caminho**: `/eventos`
* **Descrição**: Retorna o histórico de eventos/alertas ocorridos nos dispositivos do usuário.
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": [
      { "id_evento": 55, "id_dispositivo": 5, "tipo_evento": "Temperatura Alta", "nivel_criticidade": "perigo" }
    ]
  }
  ```

##### 27. Buscar Evento por ID (Protegido)
* **Método**: `GET`
* **Caminho**: `/eventos/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_evento": 55, "tipo_evento": "Temperatura Alta", "nivel_criticidade": "perigo" }
  }
  ```

##### 28. Criar Novo Evento (Protegido)
* **Método**: `POST`
* **Caminho**: `/eventos`
* **Corpo da Requisição**:
  ```json
  {
    "id_dispositivo": 5,
    "id_sensor": 1,
    "tipo_evento": "Temperatura Crítica Alta",
    "nivel_criticidade": "critico"
  }
  ```
* **Exemplo de Resposta (201 Created)**:
  ```json
  {
    "sucesso": true,
    "dados": { "id_evento": 56, "id_dispositivo": 5, "tipo_evento": "Temperatura Crítica Alta" }
  }
  ```

##### 29. Limpar Todo o Histórico de Alertas (Protegido)
* **Método**: `DELETE`
* **Caminho**: `/eventos/limpar/todos`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Histórico limpo com sucesso..."
  }
  ```

##### 30. Deletar Alerta Individual (Protegido)
* **Método**: `DELETE`
* **Caminho**: `/eventos/:id`
* **Exemplo de Resposta (200 OK)**:
  ```json
  {
    "sucesso": true,
    "mensagem": "Evento deletado com sucesso"
  }
  ```
