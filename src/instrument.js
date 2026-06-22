require('dotenv').config();
const Sentry = require('@sentry/node');
const pkg = require('../package.json');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.SENTRY_RELEASE || `${pkg.name}@${pkg.version}`,
  tracesSampleRate: 0,  // No monitoreo de rendimiento, solo captura de errores
  sendDefaultPii: true, // Enviar userId del JWT para localizar errores por usuario
});

module.exports = Sentry;
