const Sentry = require('../instrument');

// POST /v1/transfer-beta/execute
// Error 500 operacional: simula fallo de conexión a la BD y lo reporta a Sentry con tag de usuario
function executeTransfer(req, res, next) {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount === undefined) {
      return res.status(400).json({
        error: 'Petición incorrecta',
        message: 'Los campos fromAccountId, toAccountId y amount son requeridos.'
      });
    }

    // Error Operacional — fallo de conexión al clúster de datos
    // Se adjunta el userId del JWT como Tag en Sentry para trazabilidad
    const userId = req.user ? req.user.sub : 'desconocido';

    Sentry.withScope((scope) => {
      scope.setTag('userId', userId);
      scope.setTag('fromAccount', fromAccountId);
      scope.setTag('endpoint', 'POST /v1/transfer-beta/execute');
      Sentry.captureException(new Error("Conexión interrumpida con el Clúster de Datos SecurePay"));
    });

    throw new Error("Conexión interrumpida con el Clúster de Datos SecurePay");

  } catch (error) {
    // Escalar al manejador de errores global (Sentry lo captura vía setupExpressErrorHandler)
    next(error);
  }
}

module.exports = {
  executeTransfer
};
