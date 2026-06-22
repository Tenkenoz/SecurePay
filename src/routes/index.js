const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const accountRoutes = require('./account.routes');
const transferRoutes = require('./transfer.routes');

// Rutas de autenticación (sin middleware de auth — genera el token para el usuario)
router.use('/auth', authRoutes);

// Rutas protegidas por middleware JWT RS256
router.use('/account-alpha', accountRoutes);
router.use('/transfer-beta', transferRoutes);

module.exports = router;
