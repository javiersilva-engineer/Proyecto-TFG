const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');

router.post('/', controller.crearUsuario);
router.get('/', controller.obtenerUsuarios);
router.post('/login', controller.loginUsuario);

module.exports = router;