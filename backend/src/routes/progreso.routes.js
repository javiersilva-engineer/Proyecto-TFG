const express = require('express');
const router = express.Router();
const controller = require('../controllers/progreso.controller');

// Obtener progreso diario
router.get('/:usuarioId/:fecha', controller.obtenerProgresoDiario);

// Marcar / desmarcar comida hecha
router.post('/toggle', controller.toggleComidaHecha);

module.exports = router;