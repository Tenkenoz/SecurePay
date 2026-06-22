const express = require('express');
const router = express.Router();
const jwtService = require('../services/jwt.service');
const { usersDb } = require('../services/transaction.monolith.service');

/**
 * POST /v1/auth/login
 * 
 * Endpoint de autenticación que genera un JWT RS256 firmado.
 * Recibe el email del usuario, verifica su existencia en la base de datos
 * y retorna un token con claims seguros (sub, name, exp: 2 minutos).
 * 
 * Body esperado: { "email": "estudiante.alpha@espe.edu.ec" }
 */
router.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Petición incorrecta',
      message: 'Debe proporcionar el campo "email" en el cuerpo de la petición.'
    });
  }

  // Buscar usuario en la base de datos simulada
  const user = usersDb.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
      message: `No existe ningún usuario registrado con el email: ${email}`
    });
  }

  // Generar token JWT firmado asimétricamente con RS256
  const token = jwtService.signToken({ id: user.id, email: user.email });

  console.log(`[AUTH LOGIN] ✅ Token generado para usuario: ${user.id} (${user.email})`);

  return res.status(200).json({
    success: true,
    message: 'Autenticación exitosa. Token generado con RS256 (expira en 2 minutos).',
    token,
    user: {
      id: user.id,
      email: user.email,
      accountAlpha: user.accountAlpha
    }
  });
});

module.exports = router;
