# Aplicativo BabyGuard 

O *BabyGuard* é um sistema IoT para monitoramento contínuo do ambiente de bebês. A solução integra hardware embarcado, backend e aplicativo móvel, permitindo coleta, processamento e visualização de dados em tempo real, com foco em segurança, detecção de anomalias e resposta rápida.

---

## Arquitetura do Projeto

O repositório utiliza o modelo de monorepo, organizando os componentes em três módulos principais:

```
/frontend   → Aplicativo mobile (React Native + Expo)
/backend    → API REST (Node.js + Express)
/hardware   → Firmware ESP32 (C/C++)
```

Essa organização centraliza o desenvolvimento e facilita manutenção, integração e avaliação do sistema.

---

## Tecnologias Utilizadas

### Frontend

* React Native (Expo)
* TypeScript
* React Navigation
* AsyncStorage / SQLite (persistência offline)

### Backend

* Node.js
* Express
* Autenticação via JWT
* Middleware de autorização
* Integração com MQTT

### Hardware

* ESP32
* Sensores:

  * DHT11 / DHT22 (temperatura e umidade)
  * LDR (luminosidade)
  * HC-SR04 (distância)
* Comunicação via protocolo MQTT

---

## Fluxo de Funcionamento

1. O ESP32 realiza a leitura dos sensores
2. Os dados são enviados para um broker MQTT
3. O backend consome as mensagens
4. Os dados são persistidos como leituras
5. Eventos são gerados com base em regras de negócio
6. O aplicativo consome a API REST
7. O aplicativo pode operar offline e sincronizar posteriormente

---

## API REST

### Base URL

```
http://localhost:3000
```

---

## Autenticação

A API utiliza autenticação baseada em token JWT.

Todas as rotas, exceto as de autenticação, exigem o header:

```
Authorization: Bearer <token>
```

---

## Padrão de Resposta

### Sucesso

```json
{
  "sucesso": true,
  "mensagem": "string",
  "dados": {}
}
```

### Erro

```json
{
  "sucesso": false,
  "mensagem": "string",
  "erro": "string"
}
```

---

## Entidades

### Usuários

Representam os responsáveis pelo monitoramento.

Campos:

* id_usuario
* nome
* email
* senha_hash
* telefone
* foto_perfil
* status_usuario

---

### Dispositivos

Representam os dispositivos físicos (ESP32).

Campos:

* id_dispositivo
* nome
* localizacao
* id_usuario

---

### Sensores

Representam os sensores vinculados a dispositivos.

Campos:

* id_sensor
* tipo
* id_dispositivo

---

### Leituras

Representam os dados coletados pelos sensores.

Campos:

* id_leitura
* valor
* data_hora
* id_sensor

---

### Eventos

Representam ocorrências relevantes detectadas pelo sistema.

Campos:

* id_evento
* tipo
* descricao
* data_hora
* id_dispositivo

---

## Endpoints

### Autenticação (/auth)

Rotas públicas.

#### POST /auth/registro

Cria um novo usuário.

Request:

```json
{
  "nome": "string",
  "email": "string",
  "senha": "string",
  "telefone": "string"
}
```

---

#### POST /auth/login

Realiza autenticação e retorna um token.

Request:

```json
{
  "email": "string",
  "senha": "string"
}
```

Response:

```json
{
  "sucesso": true,
  "mensagem": "Login realizado",
  "dados": {
    "token": "string"
  }
}
```

---

#### POST /auth/logout

Invalida o token atual (blacklist).

Requer autenticação.

---

#### GET /auth/validar

Valida o token atual.

Requer autenticação.

---

### Usuários (/usuarios)

Todas as rotas são protegidas.

#### GET /usuarios

Lista usuários.

---

#### GET /usuarios/:id

Busca usuário por ID.

---

#### POST /usuarios

Cria um novo usuário.

Request:

```json
{
  "nome": "string",
  "email": "string",
  "senha": "string"
}
```

---

#### DELETE /usuarios/:id

Remove um usuário.

---

### Dispositivos (/dispositivos)

#### GET /dispositivos

Lista dispositivos do usuário autenticado.

---

#### POST /dispositivos

Cria um dispositivo.

Request:

```json
{
  "nome": "string",
  "localizacao": "string"
}
```

---

### Sensores (/sensores)

#### GET /sensores

Lista sensores.

---

#### GET /sensores/:id

Busca sensor por ID.

---

### Leituras (/leituras)

#### GET /leituras

Lista leituras.

---

#### GET /leituras/:id

Busca leitura por ID.

---

#### POST /leituras

Cria uma nova leitura.

Request:

```json
{
  "valor": 0,
  "id_sensor": 0
}
```

---

#### DELETE /leituras/:id

Remove uma leitura.

---

### Eventos (/eventos)

#### GET /eventos

Lista eventos.

---

#### GET /eventos/:id

Busca evento por ID.

---

#### POST /eventos

Cria um evento.

Request:

```json
{
  "tipo": "string",
  "descricao": "string",
  "id_dispositivo": 0
}
```

---

#### DELETE /eventos/:id

Remove um evento.

---

## Segurança

* Rotas protegidas por autenticação JWT
* Tokens podem ser invalidados via logout
* Middleware global de autenticação aplicado após /auth
* CORS liberado (deve ser restrito em produção)
* Tratamento centralizado de erros

---


## Como rodar o projeto localmente

Siga as instruções abaixo para executar os módulos do projeto em sua máquina.

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [Git](https://git-scm.com/)
* Aplicativo *Expo Go* instalado no seu smartphone (ou emulador configurado).

### Passo a Passo

1. **Clone este repositório:**
   ```bash
   git clone [https://github.com/App-Baby-Guard/Baby-Guard.git](https://github.com/App-Baby-Guard/Baby-Guard.git)
   cd Baby-Guard
