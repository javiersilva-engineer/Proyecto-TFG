const axios = require('axios');
const pool = require('./db'); // conexión a PostgreSQL

const API_KEY = '7917cbaf85784f07960c159bf8ce77fa';
const BASE_URL = 'https://api.spoonacular.com';

// ================== FUNCIONES ==================

// Obtener recetas desde Spoonacular
async function obtenerRecetas(numero = 10) {
  try {
    const res = await axios.get(`${BASE_URL}/recipes/random`, {
      params: { number: numero, apiKey: API_KEY }
    });
    return res.data.recipes;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Guardar receta en PostgreSQL
async function guardarReceta(receta) {
  try {
    const result = await pool.query(
      `INSERT INTO recetas 
      (nombre, instrucciones, duracion, imagen) 
      VALUES ($1,$2,$3,$4) 
      RETURNING *`,
      [receta.title, receta.instructions || '', receta.readyInMinutes, receta.image || '']
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
}

// Guardar ingredientes y alérgenos
async function guardarIngredientesYAlergenos(recetaDb, recetaData) {
  for (const ing of recetaData.extendedIngredients) {
    // Guardar alérgeno si existe
    let alergenoId = null;
    if (ing.aisle) {
      const alergenoRes = await pool.query(
        'INSERT INTO alergenos (nombre) VALUES ($1) ON CONFLICT (nombre) DO UPDATE SET nombre=EXCLUDED.nombre RETURNING id',
        [ing.aisle]
      );
      alergenoId = alergenoRes.rows[0].id;
    }

    // Guardar ingrediente
    const ingRes = await pool.query(
      `INSERT INTO ingredientes 
       (nombre, calorias_100g, carbohidratos_100g, grasas_100g, proteinas_100g, alergeno_id) 
       VALUES ($1,$2,$3,$4,$5,$6) 
       ON CONFLICT (nombre) DO UPDATE 
       SET nombre=EXCLUDED.nombre RETURNING id`,
      [
        ing.name,
        ing.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
        ing.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0,
        ing.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0,
        ing.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0,
        alergenoId
      ]
    );
    const ingredienteId = ingRes.rows[0].id;

    // Asociar ingrediente con receta
    await pool.query(
      `INSERT INTO receta_ingrediente 
       (receta_id, ingrediente_id, cantidad, unidad) 
       VALUES ($1,$2,$3,$4) 
       ON CONFLICT DO NOTHING`,
      [recetaDb.id, ingredienteId, ing.amount || 0, ing.unit || 'unidad']
    );
  }

  // Actualizar totales de la receta
  await pool.query(
    `UPDATE recetas r
     SET
       calorias_total = sub.total_calorias,
       carbohidratos_total = sub.total_carbs,
       grasas_total = sub.total_grasas,
       proteinas_total = sub.total_proteinas
     FROM (
       SELECT ri.receta_id,
              SUM(ri.cantidad * i.calorias_100g / 100) AS total_calorias,
              SUM(ri.cantidad * i.carbohidratos_100g / 100) AS total_carbs,
              SUM(ri.cantidad * i.grasas_100g / 100) AS total_grasas,
              SUM(ri.cantidad * i.proteinas_100g / 100) AS total_proteinas
       FROM receta_ingrediente ri
       JOIN ingredientes i ON ri.ingrediente_id = i.id
       GROUP BY ri.receta_id
     ) sub
     WHERE r.id = sub.receta_id`
  );
}

// ================== FUNCION PRINCIPAL ==================
async function poblarRecetas(numero = 5) {
  const recetas = await obtenerRecetas(numero);
  for (const receta of recetas) {
    const recetaDb = await guardarReceta(receta);
    await guardarIngredientesYAlergenos(recetaDb, receta);
  }
  console.log('Recetas de Spoonacular anadidas a la base de datos');
}

module.exports = { poblarRecetas };
