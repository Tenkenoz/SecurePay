const jwt = require('jsonwebtoken');
const jwtService = require('../services/jwt.service');

// Middleware que verifica el Bearer Token RS256 en cada ruta protegida.
// Errores 401/403 son errores lógicos esperados — NO se reportan a Sentry.
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser: Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    // Verifica con clave pública RS256 de forma autónoma (sin servidor central)
    const decodedPayload = jwtService.verifyToken(token);
    req.user = decodedPayload;
    console.log(`[AUTH] Token válido para usuario: ${decodedPayload.sub}`);
    next();

  } catch (error) {
    // Error lógico de seguridad — respuesta controlada, sin escalar a Sentry
    if (error instanceof jwt.TokenExpiredError) {
      console.warn(`[AUTH] Token expirado.`);
      return res.status(403).json({
        error: 'Token expirado',
        message: 'El token ha caducado. Genere uno nuevo.',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.warn(`[AUTH] Token inválido: ${error.message}`);
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token no es auténtico o está malformado.',
      code: 'TOKEN_INVALID'
    });
  }
}

module.exports = authMiddleware;
