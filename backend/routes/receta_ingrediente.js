const express = require('express');
const router = express.Router();
const pool = require('../db');

// Anadir un ingrediente a una receta
router.post('/', async (req, res) => {
  const { receta_id, ingrediente_id, cantidad, unidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO receta_ingrediente (receta_id, ingrediente_id, cantidad, unidad) VALUES ($1,$2,$3,$4) RETURNING *',
      [receta_id, ingrediente_id, cantidad, unidad]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar ingredientes de una receta específica
router.get('/:receta_id', async (req, res) => {
  const { receta_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT ri.cantidad, ri.unidad, i.id AS ingrediente_id, i.nombre AS ingrediente_nombre,
              i.calorias_100g, i.carbohidratos_100g, i.grasas_100g, i.proteinas_100g, i.alergeno_id
       FROM receta_ingrediente ri
       JOIN ingredientes i ON ri.ingrediente_id = i.id
       WHERE ri.receta_id = $1`,
      [receta_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un ingrediente de una receta
router.delete('/', async (req, res) => {
  const { receta_id, ingrediente_id } = req.body;
  try {
    const result = await pool.query(
      'DELETE FROM receta_ingrediente WHERE receta_id = $1 AND ingrediente_id = $2 RETURNING *',
      [receta_id, ingrediente_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
