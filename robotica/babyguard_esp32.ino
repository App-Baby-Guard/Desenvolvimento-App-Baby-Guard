/********************************************************************************
 * PROJETO: BabyGuard
 * Monitoramento ambiental do berço via ESP32 + Blynk
 *
 * Sensores: DHT11 (temp/umidade), Luz Digital, HC-SR04 (distância)
 * Atuador:  LED RGB (indicador de temperatura)
 * App:      Blynk IoT (leitura de dados + controle manual dos LEDs)
 ********************************************************************************/

#define BLYNK_TEMPLATE_ID   "TMPL2PwHp98oM"
#define BLYNK_TEMPLATE_NAME "Baby Guard MVP"
#define BLYNK_AUTH_TOKEN    "ac0J8j5rv3LfVR3rUSV6-NbMkrUnBEi6"
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include <DHT.h>

// Credenciais Wi-Fi (use "Wokwi-GUEST" para simulação)
char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "Wokwi-GUEST";
char pass[] = "";

// Pinos
#define PINO_DHT   15
#define PINO_LED_R 21
#define PINO_LED_G 19
#define PINO_LED_B 18
#define PINO_TRIG  13
#define PINO_ECHO  12
#define PINO_LDR   34  // (Pino apenas de entrada no ESP32, requer pull-up externo)

DHT dht(PINO_DHT, DHT11);
BlynkTimer timer;

// Estado do dispositivo e controle manual dos LEDs
bool dispositivoAtivo = true;
bool ledManualR = false;
bool ledManualG = false;
bool ledManualB = false;

/********************************************************************************
 * FUNÇÕES AUXILIARES
 ********************************************************************************/

// Liga ou desliga os três canais do LED RGB de uma vez
void acenderLED(int r, int g, int b) {
  digitalWrite(PINO_LED_R, r);
  digitalWrite(PINO_LED_G, g);
  digitalWrite(PINO_LED_B, b);
}

// Acende o LED na cor correspondente à faixa de temperatura
// Não age se o dispositivo estiver em standby ou se algum LED estiver em modo manual
void alertarTemperatura(float temp) {
  if (!dispositivoAtivo) return;
  if (ledManualR || ledManualG || ledManualB) return;

  if (temp < 20.0)       acenderLED(LOW,  LOW,  HIGH); // Azul  = frio
  else if (temp <= 28.0) acenderLED(LOW,  HIGH, LOW);  // Verde = ideal
  else                   acenderLED(HIGH, LOW,  LOW);  // Vermelho = quente
}

// Dispara o HC-SR04 e retorna a distância em cm (-1 se falhar)
float lerDistancia() {
  digitalWrite(PINO_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PINO_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PINO_TRIG, LOW);

  // O timeout de 30000 microssegundos (~30ms) evita travamentos se o sensor desconectar
  unsigned long duracao = pulseIn(PINO_ECHO, HIGH, 30000);
  if (duracao == 0) return -1.0;
  return duracao / 58.8;
}

// Lê o sensor de luz digital e retorna:
//   1 = claro (pino LOW, luz detectada)
//   0 = escuro (pino HIGH, sem luz)
int lerLuminosidade() {
  return (digitalRead(PINO_LDR) == LOW) ? 1 : 0;
}

/********************************************************************************
 * LEITURA E ENVIO — chamada pelo timer a cada 5 segundos
 ********************************************************************************/
void lerSensoresEEnviar() {
  if (!dispositivoAtivo) {
    Serial.println("[BabyGuard] Standby ativo — leituras suspensas.");
    return;
  }

  float temp = dht.readTemperature();
  float umid = dht.readHumidity();
  bool  dhtOk = !isnan(temp) && !isnan(umid);

  float dist = lerDistancia();
  int   luz  = lerLuminosidade(); // 0 = escuro, 1 = claro

  // Log no Serial Monitor
  if (dhtOk) Serial.printf("[BabyGuard] Temp: %.1f°C | Umid: %.1f%% | ", temp, umid);
  else        Serial.print("[BabyGuard] DHT: ERRO | ");
  Serial.printf("Dist: %.1fcm | Luz: %d\n", dist, luz);

  // Envia ao Blynk
  if (dhtOk) {
    Blynk.virtualWrite(V3, temp);
    Blynk.virtualWrite(V4, umid);
    alertarTemperatura(temp);
  }
  Blynk.virtualWrite(V6, dist);
  Blynk.virtualWrite(V5, luz); 
}

/********************************************************************************
 * CALLBACKS DO BLYNK — acionados pelo app
 ********************************************************************************/

// Switches manuais dos LEDs (V0=vermelho, V1=azul, V2=verde)
BLYNK_WRITE(V0) { int v = param.asInt(); ledManualR = v; digitalWrite(PINO_LED_R, v); }
BLYNK_WRITE(V1) { int v = param.asInt(); ledManualB = v; digitalWrite(PINO_LED_B, v); }
BLYNK_WRITE(V2) { int v = param.asInt(); ledManualG = v; digitalWrite(PINO_LED_G, v); }

// Liga/Desliga o dispositivo (V7: 1=ligado, 0=standby)
BLYNK_WRITE(V7) {
  dispositivoAtivo = param.asInt();

  if (!dispositivoAtivo) {
    Serial.println("[BabyGuard] Standby ativado — LEDs apagados.");
    acenderLED(LOW, LOW, LOW);
    ledManualR = ledManualG = ledManualB = false;
    // Envia -99 para sinalizar standby no app
    Blynk.virtualWrite(V3, -99.0);
    Blynk.virtualWrite(V4, -99.0);
    Blynk.virtualWrite(V5, -99.0);
    Blynk.virtualWrite(V6, -99.0);
  } else {
    Serial.println("[BabyGuard] Monitoramento reativado.");
    lerSensoresEEnviar();
  }
}

/********************************************************************************
 * SETUP
 ********************************************************************************/
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== BabyGuard — Iniciando... ===");

  pinMode(PINO_LED_R, OUTPUT);
  pinMode(PINO_LED_G, OUTPUT);
  pinMode(PINO_LED_B, OUTPUT);
  acenderLED(LOW, LOW, LOW);

  pinMode(PINO_TRIG, OUTPUT);
  digitalWrite(PINO_TRIG, LOW);
  pinMode(PINO_ECHO, INPUT);
  pinMode(PINO_LDR, INPUT);

  dht.begin();
  Serial.println("[OK] Sensores iniciados");

  Blynk.begin(auth, ssid, pass);
  Serial.println("[OK] Blynk conectado");

  timer.setInterval(5000L, lerSensoresEEnviar);
  Serial.println("[OK] Leituras a cada 5s\n");
}

/********************************************************************************
 * LOOP
 ********************************************************************************/
void loop() {
  Blynk.run(); // Mantém conexão e processa callbacks
  timer.run(); // Executa leituras no intervalo configurado
}
