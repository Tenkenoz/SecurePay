// Sentry debe importarse primero, antes de Express o cualquier otra librería
const Sentry = require('./src/instrument');

require('dotenv').config();
const express = require('express');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/v1', routes);

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'fintech-securepay-base',
    description: 'API base para evaluaciones de aplicaciones distribuidas (ESPE)',
    status: 'ONLINE'
  });
});

// Middleware de errores de Sentry — captura errores 500 operacionales
Sentry.setupExpressErrorHandler(app);

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor Fintech ejecutándose en: http://localhost:${PORT}`);
  console.log(`   - Login:            POST http://localhost:${PORT}/v1/auth/login`);
  console.log(`   - Balance Alpha:    GET  http://localhost:${PORT}/v1/account-alpha/balance`);
  console.log(`   - Transferencia Beta: POST http://localhost:${PORT}/v1/transfer-beta/execute`);
  console.log(`======================================================\n`);
});
