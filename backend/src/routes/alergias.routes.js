const express = require('express');
const router = express.Router();
const Alergia = require('../models/alergia');

// Crear alergia
router.post('/', async (req, res) => {
  const alergia = await Alergia.create(req.body);
  res.json(alergia);
});

// Obtener todas las alergias
router.get('/', async (req, res) => {
  const alergias = await Alergia.find();
  res.json(alergias);
});

module.exports = router;