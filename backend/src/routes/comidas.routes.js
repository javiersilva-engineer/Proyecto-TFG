const express = require('express');
const router = express.Router();

const Comida = require('../models/comida');
const Ingrediente = require('../models/ingrediente');

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


// Obtener comidas por nombre de ingrediente
router.get('/ingrediente/:nombre', async (req, res) => {
  try {

    // Buscar el ingrediente por nombre
    const ingrediente = await Ingrediente.findOne({
      nombre: new RegExp(`^${req.params.nombre}$`, 'i')
    });

    if (!ingrediente) {
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }

    // Buscar comidas que contengan ese ingrediente (por ID)
    const comidas = await Comida.find({
      ingredientes: ingrediente._id
    }).populate({
      path: 'ingredientes',
      populate: { path: 'alergias' }
    });

    res.json(comidas);

  } catch (error) {
    res.status(500).json({ message: 'Error buscando comidas', error });
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