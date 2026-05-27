# BabyGuard: Amor, Cuidado e Proteção em Tempo Real

O BabyGuard nasceu do desejo de oferecer tranquilidade aos pais e proteção absoluta aos bebês. Muito mais do que uma babá eletrônica, o sistema funciona como um guardião digital zeloso, monitorando o microclima do berço e o bem-estar da criança. Através da união entre hardware delicadamente calibrado, uma infraestrutura em nuvem acolhedora e um aplicativo móvel intuitivo, o BabyGuard transforma dados ambientais em paz de espírito para a sua família.

---

## O Ecossistema de Proteção

A arquitetura do BabyGuard foi desenhada para garantir que nenhuma leitura se perca e que cada variação no ambiente do bebê seja tratada com a máxima prioridade e carinho. O sistema opera de forma integrada e totalmente distribuída na nuvem.

```
 [Hardware ESP32] ----( Protocolo MQTT )----> [Broker MQTT Cloud]
                                                    |
                                            (Ingestion Loop)
                                                    |
 [App Mobile] <---( HTTP / JSON )---> [API Express no Render] <---> [Banco Supabase]

```

---

## Organização do Projeto (Monorepo)

Para manter o desenvolvimento desse ecossistema de cuidado centralizado e harmonioso, o repositório utiliza o modelo de monorepo:

```
/
├── backend/       --> O coração do sistema: API em Node.js hospedada no Render
└── frontend/      --> O olhar dos pais: Aplicativo mobile feito em React Native e Expo

```

---

## Tecnologias e Ninhos de Armazenamento

Para garantir que o monitoramento seja ininterrupto, seguro e incrivelmente rápido, escolhemos tecnologias modernas e robustas para abrigar os dados do seu bebê.

```
+-------------------------------------------------------------------+
|                            FRONTEND                               |
|  [React Native]   [TypeScript]     [Expo Core]    [Persistência]  |
+-------------------------------------------------------------------+
|                         NUVEM & BACKEND                           |
|  [Hospedagem Render] [Node.js/Express] [JWT Auth]  [MQTT Consumer]|
+-------------------------------------------------------------------+
|                         BANCO DE DADOS                            |
|  [Supabase Cloud]    [PostgreSQL Engine]   [Segurança Concorrente]|
+-------------------------------------------------------------------+

```

### Detalhes das Camadas Tecnológicas

### O Olhar dos Pais (Frontend Mobile)

* Estrutura Nativa: Desenvolvido em React Native com a agilidade do ecossistema Expo.
* Tipagem Segura: Construído inteiramente em TypeScript, garantindo um código livre de falhas para o cuidado da criança.
* Navegação Fluida: Interfaces projetadas com React Navigation para que os pais acessem o histórico do bebê com um único toque.

### O Coração do Sistema (Backend no Render)

* Hospedagem de Confiança: A API está hospedada na plataforma Render, garantindo alta disponibilidade e respostas instantâneas às requisições do aplicativo.
* Processamento Assíncrono: Motor construído em Node.js e Express, preparado para receber múltiplos dados de telemetria sem oscilações.
* Escuta Ativa: Consumidores focados na leitura contínua das filas de mensagens geradas pelo hardware no berço.

### O Cofre das Memórias (Banco de Dados no Supabase)

* Nuvem Escalável: Toda a persistência de usuários, configurações e logs ambientais foi migrada para o Supabase, aproveitando a resiliência e a velocidade do PostgreSQL em nuvem.
* Integridade dos Dados: Tabelas estruturadas para guardar cada variação de temperatura e movimento de forma eterna e segura.

### O Guardião Físico (Hardware Embarcado)

* Cérebro do Dispositivo: Placa ESP32 atuando com processamento dual-core para leitura em tempo real.
* Sensores de Carinho:
* DHT11 / DHT22: Cuidando da temperatura ideal do quarto e da umidade do ar.
* LDR (Luminosidade): Monitorando se a iluminação do quarto está propícia para o sono profundo.
* HC-SR04: Proteção ultrassônica para verificar o posicionamento e pequenas movimentações.



---

## O Caminho do Cuidado: Fluxo Operacional

```
[Berço do Bebê] ---> [Leitura dos Sensores] ---> [Transmissão MQTT] ---> [API no Render]
                                                                              |
[Notificação no App] <--- [Geração de Alertas] <--- [Supabase Cloud] <--------+

```

1. Percepção Atenta: O ESP32 colhe com precisão cada alteração climática e sonora no quarto do bebê.
2. Envio Seguro: Essas informações são envelopadas e transmitidas via protocolo leve MQTT para a nuvem.
3. Acolhimento dos Dados: A API hospedada no Render recebe as leituras e analisa se tudo está dentro dos padrões de conforto definidos pelos pais.
4. Registro Histórico: O Supabase armazena instantaneamente essas leituras, criando um diário completo da rotina do berço.
5. Alerta Protetor: Se a temperatura subir demais ou o quarto ficar barulhento, o sistema gera um evento de atenção e envia uma notificação imediata para o smartphone dos pais.

---

## Endereço da API em Nuvem

O ecossistema deixou o ambiente local e agora está acessível globalmente através da infraestrutura de produção do Render:

```
https://desenvolvimento-app-baby-guard.onrender.com

```

---

## Engenharia de Segurança e Conforto

* Abraço Criptográfico: Todas as rotas que exibem informações do bebê exigem validação rigorosa através de tokens JWT passados no cabeçalho das requisições.
* Privacidade Familiar: Os tokens são invalidados imediatamente ao encerrar a sessão, protegendo os dados de visualizações não autorizadas.
* Filtro de Proteção: Middlewares barram qualquer tentativa de envio de dados corrompidos antes mesmo que eles cheguem ao banco de dados Supabase.
* Isolamento de Erros: Caso ocorra alguma instabilidade no hardware, a API trata a falha de forma silenciosa e amigável, sem interromper a exibição das telas do aplicativo móvel.

---

## Configuração e Instalação do Projeto

Siga as instruções para conectar o seu ambiente de desenvolvimento à nossa estrutura de nuvem.

### Pré-requisitos do Sistema

* Node.js (Versão estável LTS 18 ou superior).
* Git instalado para clonar o repositório.
* Contas configuradas nas plataformas Render e Supabase para espelhar as variáveis de ambiente.
* Smartphone com o aplicativo Expo Go para visualizar a interface gráfica.

### Clonando o Repositório

```bash
git clone https://github.com/App-Baby-Guard/Desenvolvimento-App-Baby-Guard.git
cd Desenvolvimento-App-Baby-Guard

```

### Configurando e Rodando a API (Render / Local)

```bash
cd backend
npm install

# Certifique-se de configurar o arquivo .env com a string de conexão do seu Supabase
npm run dev

```

### Configurando e Rodando o Aplicativo (Mobile)

```bash
cd ../frontend
npm install

# Configure a URL da API apontando para o seu endereço do Render
npx expo start

```

Abra o aplicativo Expo Go no seu celular, faça a leitura do código gerado no terminal e comece a acompanhar o monitoramento em tempo real com todo o cuidado e precisão que o seu bebê merece.