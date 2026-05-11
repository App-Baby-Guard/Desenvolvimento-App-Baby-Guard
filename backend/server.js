const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

// Variável em memória para armazenar a última leitura enviada pelo ESP32
let ultimaLeitura = {
  temperatura: 0,
  umidade: 0,
  luminosidade: 0,
  proximidade: 0,
  timestamp: new Date().toISOString()
};

//  POST: ESP32 -  ENVIAR dados
app.post('/sensores', (req, res) => {
  const { temperatura, umidade, luminosidade, proximidade } = req.body;

  ultimaLeitura = {
    temperatura: temperatura !== undefined ? temperatura : ultimaLeitura.temperatura,
    umidade: umidade !== undefined ? umidade : ultimaLeitura.umidade,
    luminosidade: luminosidade !== undefined ? luminosidade : ultimaLeitura.luminosidade,
    proximidade: proximidade !== undefined ? proximidade : ultimaLeitura.proximidade,
    timestamp: new Date().toISOString() // Salva a hora exata da leitura
  };

  console.log(' Novos dados recebidos do ESP32:', ultimaLeitura);
  
  res.status(200).json({ message: 'Dados recebidos com sucesso pelo backend!' });
});

//  GET
app.get('/sensores', (req, res) => {
  res.status(200).json(ultimaLeitura);
});

app.listen(PORT, () => {
  console.log(`Servidor do BabyGuard rodando na porta ${PORT}`);
  console.log(`Rota de leitura (App): GET http://localhost:${PORT}/sensores`);
  console.log(`Rota de gravação (ESP32): POST http://localhost:${PORT}/sensores`);
});