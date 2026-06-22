const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Firma el token con la clave privada RS256, expira en 2 minutos
function signToken(user) {
  const privateKey = fs.readFileSync(
    path.join(__dirname, '../../private.pem'),
    'utf8'
  );

  const payload = {
    sub: user.id,
    name: user.email,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2m'
  });
}

// Verifica el token usando solo la clave pública (stateless, autónomo)
function verifyToken(token) {
  const publicKey = fs.readFileSync(
    path.join(__dirname, '../../public.pem'),
    'utf8'
  );

  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

module.exports = {
  signToken,
  verifyToken
};
