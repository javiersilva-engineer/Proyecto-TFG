const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear usuario
router.post('/', async (req, res) => {
  const { usuario, contrasena, email, edad, sexo, altura, peso, deporte } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (usuario, contrasena, email, edad, sexo, altura, peso, deporte) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [usuario, contrasena, email, edad, sexo, altura, peso, deporte]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
