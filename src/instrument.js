require('dotenv').config();
const Sentry = require('@sentry/node');
const pkg = require('../package.json');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.SENTRY_RELEASE || `${pkg.name}@${pkg.version}`,
  tracesSampleRate: 0,     // Solo trazabilidad de errores, no monitoreo de rendimiento
  sampleRate: 1.0,         // Capturar el 100% de los errores del sistema
  sendDefaultPii: true,    // Enviar userId del JWT para localizar errores por usuario
  enabled: Boolean(process.env.SENTRY_DSN), // No inicializar si no hay DSN configurado
});

module.exports = Sentry;
