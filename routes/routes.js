// routes.js
const express = require('express');
const router = express.Router();
const { getJoyas, getJoyasFiltros } = require('../services/joyasService');

// Ruta GET /joyas
router.get('/joyas', getJoyas);

// Ruta GET /joyas/filtros
router.get('/joyas/filtros', getJoyasFiltros);

module.exports = router;
