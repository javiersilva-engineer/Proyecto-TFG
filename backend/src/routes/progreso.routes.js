const express = require('express');
const router = express.Router();
const controller = require('../controllers/progreso.controller');

// Obtener racha hasta una fecha concreta
router.get('/racha/:usuarioId/:fecha', controller.obtenerRacha);

// Obtener progreso diario
router.get('/:usuarioId/:fecha', controller.obtenerProgresoDiario);

// Marcar / desmarcar comida hecha
router.post('/toggle', controller.toggleComidaHecha);

module.exports = router;