const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');

// Crear usuario
router.post('/', controller.crearUsuario);

//Obtener todos los usuarios
router.get('/', controller.obtenerUsuarios);

// Iniciar sesión
router.post('/login', controller.loginUsuario);

module.exports = router;