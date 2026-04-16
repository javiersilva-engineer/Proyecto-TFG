const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const Comida = require('../models/comida');
const Ingrediente = require('../models/ingrediente');
const Alergia = require('../models/alergia');

// ----------------------------------------------------
// CONFIGURACIÓN MULTER
// ----------------------------------------------------
const carpetaDestino = path.join(__dirname, '../uploads/recetas');

// Crear carpeta si no existe
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombreBase = path
      .basename(file.originalname, extension)
      .replace(/\s+/g, '_')
      .replace(/[^\w\-]/g, '');

    const nombreFinal = `${Date.now()}_${nombreBase}${extension}`;
    cb(null, nombreFinal);
  }
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no permitido. Usa JPG, PNG o WEBP.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

// ----------------------------------------------------
// CREAR COMIDA
// ----------------------------------------------------
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const {
      nombreInterno,
      nombreES,
      calorias,
      proteinas,
      carbohidratos,
      grasas,
      recetaInterna,
      recetaES,
      minCocina,
      segCocina,
      tipoComida,
      ingredientes
    } = req.body;

    let ingredientesParseados = [];
    let tipoComidaParseado = [];

    try {
      ingredientesParseados = ingredientes ? JSON.parse(ingredientes) : [];
    } catch (error) {
      return res.status(400).json({
        message: 'El campo ingredientes no tiene un formato JSON válido'
      });
    }

    try {
      tipoComidaParseado = tipoComida ? JSON.parse(tipoComida) : [];
    } catch (error) {
      return res.status(400).json({
        message: 'El campo tipoComida no tiene un formato JSON válido'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'Debes subir una imagen para la receta'
      });
    }

    const imagenRuta = `/uploads/recetas/${req.file.filename}`;

    const nuevaComida = await Comida.create({
      nombreInterno,
      nombreES,
      calorias: Number(calorias),
      proteinas: Number(proteinas),
      carbohidratos: Number(carbohidratos),
      grasas: Number(grasas),
      imagen: imagenRuta,
      recetaInterna,
      recetaES,
      minCocina: Number(minCocina),
      segCocina: Number(segCocina || 0),
      tipoComida: tipoComidaParseado,
      ingredientes: ingredientesParseados
    });

    const comidaCreada = await Comida.findById(nuevaComida._id).populate({
      path: 'ingredientes.ingrediente',
      populate: { path: 'alergias' }
    });

    res.status(201).json(comidaCreada);
  } catch (error) {
    res.status(500).json({
      message: 'Error creando comida',
      error: error.message
    });
  }
});

// ----------------------------------------------------
// OBTENER TODAS LAS COMIDAS
// ----------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const comidas = await Comida.find()
      .populate({
        path: 'ingredientes.ingrediente',
        populate: {
          path: 'alergias'
        }
      });

    res.json(comidas);
  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo comidas',
      error: error.message
    });
  }
});

// ----------------------------------------------------
// FILTRAR COMIDAS POR NOMBRE, INGREDIENTES, CALORÍAS Y ALERGIAS
// ----------------------------------------------------
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

    if (minCalorias !== undefined && minCalorias !== '') {
      comidas = comidas.filter(c => (c.calorias || 0) >= Number(minCalorias));
    }

    if (maxCalorias !== undefined && maxCalorias !== '') {
      comidas = comidas.filter(c => (c.calorias || 0) <= Number(maxCalorias));
    }

    if (alergias && alergias.trim() !== '') {
      const alergiasArray = alergias
        .split(',')
        .map(a => a.trim().toLowerCase());

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

// ----------------------------------------------------
// OBTENER COMIDAS SIN CIERTAS ALERGIAS
// ----------------------------------------------------
router.get('/sin-alergias', async (req, res) => {
  try {
    const alergiasQuery = req.query.alergias;

    if (!alergiasQuery) {
      return res.status(400).json({
        message: 'Debes indicar al menos una alergia a filtrar'
      });
    }

    const alergiasFiltro = alergiasQuery
      .split(',')
      .map(a => a.trim().toLowerCase());

    const alergiasDocs = await Alergia.find({
      nombreEN: { $in: alergiasFiltro }
    });

    const alergiasIds = alergiasDocs.map(a => a._id);

    const ingredientesConAlergia = await Ingrediente.find({
      alergias: { $in: alergiasIds }
    }).select('_id');

    const ingredientesIds = ingredientesConAlergia.map(i => i._id);

    const comidas = await Comida.find({
      'ingredientes.ingrediente': { $nin: ingredientesIds }
    }).populate({
      path: 'ingredientes.ingrediente',
      populate: { path: 'alergias' }
    });

    res.json(comidas);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error obteniendo comidas',
      error: err.message
    });
  }
});

// ----------------------------------------------------
// OBTENER COMIDAS POR TIPO
// ----------------------------------------------------
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
      path: 'ingredientes.ingrediente',
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

// ----------------------------------------------------
// OBTENER COMIDA POR ID
// ----------------------------------------------------
router.get('/id/:id', async (req, res) => {
  try {
    const comida = await Comida.findById(req.params.id)
      .populate({
        path: 'ingredientes.ingrediente',
        populate: { path: 'alergias' }
      });

    if (!comida) {
      return res.status(404).json({
        message: 'Comida no encontrada'
      });
    }

    res.json(comida);

  } catch (err) {
    res.status(500).json({
      message: 'Error obteniendo comida por ID',
      error: err.message
    });
  }
});

// ----------------------------------------------------
// OBTENER COMIDA POR NOMBRE
// ----------------------------------------------------
router.get('/:nombre', async (req, res) => {
  try {
    const comida = await Comida.findOne({
      $or: [
        { nombreES: new RegExp(`^${req.params.nombre}$`, 'i') },
        { nombreInterno: new RegExp(`^${req.params.nombre}$`, 'i') }
      ]
    }).populate({
      path: 'ingredientes.ingrediente',
      populate: { path: 'alergias' }
    });

    if (!comida) {
      return res.status(404).json({
        message: 'Comida no encontrada'
      });
    }

    res.json(comida);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;