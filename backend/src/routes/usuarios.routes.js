const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');

router.post('/', controller.crearUsuario);
router.get('/', controller.obtenerUsuarios);

module.exports = router;