const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear ingrediente
router.post('/', async (req, res) => {
  const { nombre, calorias_100g, carbohidratos_100g, grasas_100g, proteinas_100g, alergeno_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ingredientes 
       (nombre, calorias_100g, carbohidratos_100g, grasas_100g, proteinas_100g, alergeno_id) 
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, calorias_100g, carbohidratos_100g, grasas_100g, proteinas_100g, alergeno_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar ingredientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;