const Sentry = require('../instrument');

// POST /v1/transfer-beta/execute
// Simula un error 500 operacional (fallo de BD) y lo reporta a Sentry con tags del usuario
function executeTransfer(req, res, next) {
  const { fromAccountId, toAccountId, amount } = req.body;

  if (!fromAccountId || !toAccountId || amount === undefined) {
    return res.status(400).json({
      error: 'Petición incorrecta',
      message: 'Los campos fromAccountId, toAccountId y amount son requeridos.'
    });
  }

  // Obtener userId del JWT para adjuntarlo como tag en Sentry
  const userId = req.user ? req.user.sub : 'desconocido';
  const errorOperacional = new Error("Conexión interrumpida con el Clúster de Datos SecurePay");

  // Reportar a Sentry con tags personalizados antes de propagar el error
  Sentry.withScope((scope) => {
    scope.setTag('userId', userId);
    scope.setTag('fromAccount', fromAccountId);
    scope.setTag('endpoint', 'POST /v1/transfer-beta/execute');
    scope.setLevel('error');
    Sentry.captureException(errorOperacional);
  });

  // Escalar al handler global de Express (responde 500)
  next(errorOperacional);
}

module.exports = {
  executeTransfer
};
