const axios = require('axios');

const Comida = require('../../models/comida');
const Ingrediente = require('../../models/ingrediente');
const Alergia = require('../../models/alergia');

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Obtener recetas aleatorias de Spoonacular
async function obtenerRecetas(numero = 5) {
  const response = await axios.get(`${BASE_URL}/recipes/random`, {
    params: {
      number: numero,
      includeNutrition: true,
      apiKey: API_KEY
    }
  });

  return response.data.recipes;
}

// Poblar la base de datos con recetas de Spoonacular
async function poblarDesdeSpoonacular(numero = 5) {
  const recetas = await obtenerRecetas(numero);

  for (const receta of recetas) {

    // Evitar duplicar comidas
    const existeComida = await Comida.findOne({ nombreComida: receta.title });
    if (existeComida) continue;

    const ingredientesIds = [];

    for (const ing of receta.extendedIngredients) {

      // Alergia
      let alergiaDoc = null;
      if (ing.aisle) {
        alergiaDoc = await Alergia.findOneAndUpdate(
          { nombreAlergia: ing.aisle },
          { nombreAlergia: ing.aisle },
          { upsert: true, new: true }
        );
      }

      // Ingrediente
      let ingredienteDoc = await Ingrediente.findOne({ nombreIngrediente: ing.name });

      if (!ingredienteDoc) {
        ingredienteDoc = await Ingrediente.create({
          nombreIngrediente: ing.name,
          calorias: ing.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
          proteinas: ing.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0,
          carbohidratos: ing.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0,
          grasas: ing.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0,
          imagen: ing.image || '',
          alergias: alergiaDoc ? [alergiaDoc._id] : []
        });
      } else if (alergiaDoc && !ingredienteDoc.alergias.includes(alergiaDoc._id)) {
        ingredienteDoc.alergias.push(alergiaDoc._id);
        await ingredienteDoc.save();
      }

      ingredientesIds.push(ingredienteDoc._id);
    }

    // Obtener nutrientes de las comidas (acceso seguro)
    function obtenerNutriente(nutrients, nombre) {
      return (nutrients || []).find(n => n.name === nombre)?.amount || 0;
    }

    const nutrientesReceta = receta.nutrition?.nutrients || [];

    // Crear comida (usar nombres de campo del esquema `Comida`)
    await Comida.create({
      nombreComida: receta.title,
      caloriasComida: obtenerNutriente(nutrientesReceta, 'Calories'),
      proteinasComida: obtenerNutriente(nutrientesReceta, 'Protein'),
      carbohidratosComida: obtenerNutriente(nutrientesReceta, 'Carbohydrates'),
      grasasComida: obtenerNutriente(nutrientesReceta, 'Fat'),
      picComida: receta.image || '',
      receta: receta.instructions || '',
      minCocina: receta.readyInMinutes,
      segCocina: 0,
      ingredientes: ingredientesIds
    });
  }

  return { message: 'Base de datos poblada correctamente' };
}

module.exports = {
  poblarDesdeSpoonacular
};