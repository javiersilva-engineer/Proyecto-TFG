const express = require('express');
const router = express.Router();
const MenuSemanalUsuario = require('../models/menuSemanalUsuario');

const Usuario = require('../models/usuario');
const { generarMenu } = require('../controllers/menu.controller');

router.post('/generar/:usuarioId', async (req, res) => {

  try {

    const usuario = await Usuario.findById(req.params.usuarioId);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const menu = await generarMenu(usuario);

    res.json(menu);

  } catch (error) {

    res.status(500).json({
      message: "Error generando menú",
      error
    });

  }

});

// Obtener menú semanal completo del usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const menu = await MenuSemanalUsuario.findOne({ usuario: req.params.usuarioId })
      .populate([
        {
          path: 'lunes.desayuno lunes.comida lunes.cena lunes.snack martes.desayuno martes.comida martes.cena martes.snack miercoles.desayuno miercoles.comida miercoles.cena miercoles.snack jueves.desayuno jueves.comida jueves.cena jueves.snack viernes.desayuno viernes.comida viernes.cena viernes.snack sabado.desayuno sabado.comida sabado.cena sabado.snack domingo.desayuno domingo.comida domingo.cena domingo.snack',
          populate: {
            path: 'ingredientes.ingrediente',
            select: 'nombreES'
          }
        }
      ]);

    if (!menu) {
      return res.status(404).json({ message: 'Menú no encontrado' });
    }

    res.json(menu);

  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo menú semanal',
      error: error.message
    });
  }
});

router.get('/semana', async (req, res) => {

  try {

    const menu = await MenuSemanalUsuario.findOne({ usuario: req.user._id })
      .populate([
        'lunes.desayuno', 'lunes.comida', 'lunes.cena', 'lunes.snack',
        'martes.desayuno', 'martes.comida', 'martes.cena', 'martes.snack',
        'miercoles.desayuno', 'miercoles.comida', 'miercoles.cena', 'miercoles.snack',
        'jueves.desayuno', 'jueves.comida', 'jueves.cena', 'jueves.snack',
        'viernes.desayuno', 'viernes.comida', 'viernes.cena', 'viernes.snack',
        'sabado.desayuno', 'sabado.comida', 'sabado.cena', 'sabado.snack',
        'domingo.desayuno', 'domingo.comida', 'domingo.cena', 'domingo.snack'
      ]);

    res.json(menu);

  } catch (error) {

    res.status(500).json({
      message: 'Error obteniendo menú',
      error
    });

  }

});

module.exports = router;