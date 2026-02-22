const express = require('express');
const router = express.Router();

const Comida = require('../models/comida');
const Ingrediente = require('../models/ingrediente');
const Alergia = require('../models/alergia');

// Crear comida
router.post('/', async (req, res) => {
  const comida = await Comida.create(req.body);
  res.json(comida);
});

// Obtener todas las comidas
router.get('/', async (req, res) => {
  try {
    const comidas = await Comida.find()
      .populate({
        path: 'ingredientes',
        populate: {
          path: 'alergias'
        }
      });

    res.json(comidas);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo comidas', error });
  }
});


// Obtener comidas que no tengan algún tipo de alergia
router.get('/sin-alergias', async (req, res) => {
  try {
    const alergiasQuery = req.query.alergias;

    if (!alergiasQuery) {
      return res.status(400).json({ message: 'Debes indicar al menos una alergia a filtrar' });
    }

    const alergiasFiltro = alergiasQuery.split(',').map(a => a.trim().toLowerCase());

    // Buscar los IDs de las alergias
    const alergiasDocs = await Alergia.find({
      nombreEN: { $in: alergiasFiltro }
    });
    const alergiasIds = alergiasDocs.map(a => a._id);

    // Buscar los IDs de ingredientes que tengan esas alergias
    const ingredientesConAlergia = await Ingrediente.find({
      alergias: { $in: alergiasIds }
    }).select('_id');

    const ingredientesIds = ingredientesConAlergia.map(i => i._id);

    // Buscar comidas que NO tengan esos ingredientes
    const comidas = await Comida.find({
      'ingredientes.ingrediente': { $nin: ingredientesIds }
    }).populate({
      path: 'ingredientes',
      populate: { path: 'alergias' }
    });

    res.json(comidas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo comidas', error: err.message });
  }
});


// Obtener comidas por tipo
router.get('/tipo/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;

    const tiposValidos = ['desayuno', 'comida', 'cena', 'snack'];

    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        message: 'Tipo de comida no válido',
        tiposPermitidos: tiposValidos
      });
    }

    const comidas = await Comida.find({
      tipoComida: tipo
    }).populate({
      path: 'ingredientes',
      populate: { path: 'alergias' }
    });

    res.json(comidas);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error obteniendo comidas por tipo',
      error: err.message
    });
  }
});


// Obtener comida por nombre
router.get('/:nombre', async (req, res) => {
  try {
    const comida = await Comida.findOne({
      nombreComida: new RegExp(`^${req.params.nombre}$`, 'i')
    })
      .populate({
        path: 'ingredientes',
        populate: { path: 'alergias' }
      });

    if (!comida) {
      return res.status(404).json({ message: 'Comida no encontrada' });
    }

    res.json(comida);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;