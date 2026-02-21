const express = require('express');
const router = express.Router();

const { poblarDesdeSpoonacular } = require('../services/spoonacular/spoonacular.service');

router.post('/poblar', async (req, res) => {
  try {
    const resultado = await poblarDesdeSpoonacular(5);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error poblando la base de datos' });
  }
});

module.exports = router;