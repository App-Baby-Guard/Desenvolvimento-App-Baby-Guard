# 👶 BabyGuard System

O **BabyGuard** é um ecossistema IoT projetado para monitorar o ambiente de bebês em tempo real, garantindo segurança, respostas rápidas e tranquilidade para os pais ou responsáveis. 

Este projeto integra hardware embarcado (ESP32) com sensores de ambiente e um aplicativo móvel cross-platform, comunicando-se via protocolo MQTT. O sistema foi desenvolvido como parte dos requisitos práticos do curso de Análise e Desenvolvimento de Sistemas.

---

## 🏗️ Estrutura do Repositório (Monorepo)

Optamos por uma arquitetura de *Monorepo* para centralizar o desenvolvimento e facilitar a avaliação da banca. O projeto está dividido nos seguintes módulos:

* 📱 **`/frontend`**: Aplicativo móvel desenvolvido em React Native (Expo) com TypeScript. Responsável pela interface do usuário, autenticação, dashboard em tempo real e persistência local de dados (Modo Offline).
* ⚙️ **`/backend`**: API de integração e lógica de ponte desenvolvida em Node.js.
* 🔌 **`/hardware`**: *(Em desenvolvimento)* Código-fonte em C/C++ para o microcontrolador ESP32, responsável pela leitura dos sensores (Temperatura, Umidade, Luminosidade e Distância) e acionamento de alertas físicos (Buzzer/LED).

---

## 🚀 Tecnologias Utilizadas

**Aplicativo (Frontend):**
* [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/)
* TypeScript
* React Navigation
* AsyncStorage / SQLite (Persistência Offline)

**Hardware e Conectividade:**
* Microcontrolador ESP32
* Sensores: DHT11/22, LDR, HC-SR04
* Protocolo de Mensageria: MQTT (Broker)

---

## 💻 Como rodar o projeto localmente

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
