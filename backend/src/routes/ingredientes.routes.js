const express = require('express');
const router = express.Router();
const Ingrediente = require('../models/ingrediente');

// Crear ingrediente
router.post('/', async (req, res) => {
  const ingrediente = await Ingrediente.create(req.body);
  res.json(ingrediente);
});

// Obtener todos los ingredientes
router.get('/', async (req, res) => {
  const ingredientes = await Ingrediente.find();
  res.json(ingredientes);
});

module.exports = router;