const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear receta
router.post('/', async (req, res) => {
  const { nombre, instrucciones, duracion, imagen } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO recetas (nombre, instrucciones, duracion, imagen) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre, instrucciones, duracion, imagen]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar recetas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recetas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
