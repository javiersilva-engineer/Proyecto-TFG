const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');

// Crear usuario
router.post('/', controller.crearUsuario);

// Obtener todos los usuarios
router.get('/', controller.obtenerUsuarios);

// Login
router.post('/login', controller.loginUsuario);

// Calcular macros de usuario
router.post('/calcular-objetivos/:id', controller.calcularObjetivosUsuario);

module.exports = router;