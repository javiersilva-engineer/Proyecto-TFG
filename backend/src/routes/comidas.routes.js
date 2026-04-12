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

// Filtrar comidas por nombre, ingredientes, calorías y alergias
router.get('/buscar/filtros', async (req, res) => {
  try {
    const {
      q,
      alergias,
      minCalorias,
      maxCalorias
    } = req.query;

    let comidas = await Comida.find()
      .populate({
        path: 'ingredientes.ingrediente',
        populate: {
          path: 'alergias'
        }
      });

    // Filtrar por búsqueda
    if (q && q.trim() !== '') {
      const texto = q.trim().toLowerCase();

      comidas = comidas.filter(comida => {
        const nombreCoincide =
          comida.nombreES?.toLowerCase().includes(texto) ||
          comida.nombreInterno?.toLowerCase().includes(texto);

        const ingredienteCoincide = comida.ingredientes?.some(item =>
          item.ingrediente?.nombreES?.toLowerCase().includes(texto) ||
          item.ingrediente?.nombreInterno?.toLowerCase().includes(texto)
        );

        return nombreCoincide || ingredienteCoincide;
      });
    }

    // Filtrar por calorías
    if (minCalorias) {
      comidas = comidas.filter(c => (c.calorias || 0) >= Number(minCalorias));
    }

    if (maxCalorias) {
      comidas = comidas.filter(c => (c.calorias || 0) <= Number(maxCalorias));
    }

    // Filtrar por alergias
    if (alergias) {
      const alergiasArray = alergias.split(',').map(a => a.trim().toLowerCase());

      comidas = comidas.filter(comida => {
        const alergiasDeLaComida = comida.ingredientes.flatMap(item =>
          item.ingrediente?.alergias?.map(a =>
            a.nombreES?.toLowerCase()
          ) || []
        );

        return !alergiasArray.some(alergia =>
          alergiasDeLaComida.includes(alergia)
        );
      });
    }

    res.json(comidas);

  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo recetas con filtros',
      error: error.message
    });
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