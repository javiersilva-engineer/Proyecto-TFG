const axios = require('axios');

const Comida = require('../../models/comida');
const Ingrediente = require('../../models/ingrediente');
const Alergia = require('../../models/alergia');

const { traducirATextoES } = require('../../utils/traductor');
const mapaAlergenos = require('../../utils/mapaAlergenos');
const mapaDishTypes = require('../../utils/mapaDishtypes');

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

function clasificarTipoComida(dishTypes = [], calorias = 0) {
  const tipos = new Set();

  // Clasificar por "dishTypes" de Spoonacular
  for (const dish of dishTypes) {
    const tipo = mapaDishTypes[dish];
    if (tipo) tipos.add(tipo);
  }

  if (tipos.size > 0) {
    return Array.from(tipos);
  }

  // Clasificar por calorías si no se detecta nada anteriormente
  if (calorias < 250) return ['snack'];
  if (calorias < 450) return ['desayuno'];
  if (calorias < 700) return ['comida'];

  return ['cena'];
}

async function detectarAlergias(nombreIngrediente) {
  const nombre = nombreIngrediente.toLowerCase();
  const alergias = [];

  for (const [alergenoEN, palabras] of Object.entries(mapaAlergenos)) {
    if (palabras.some(p => nombre.includes(p))) {
      const alergia = await Alergia.findOne({ nombreEN: alergenoEN });
      if (alergia) alergias.push(alergia._id);
    }
  }

  return alergias;
}

// Obtener recetas de Spoonacular
async function obtenerRecetas(numero = 50) {
  const response = await axios.get(`${BASE_URL}/recipes/random`, {
    params: {
      number: numero,
      includeNutrition: true,
      apiKey: API_KEY
    }
  });

  return response.data.recipes || [];
}

// Función para extraer macros
function obtenerNutriente(nutrients = [], nombre) {
  return nutrients.find(n => n.name === nombre)?.amount || 0;
}

// Poblar base de datos desde Spoonacular
async function poblarDesdeSpoonacular(numero = 50) {
  const recetas = await obtenerRecetas(numero);

  for (const receta of recetas) {
    // Comprobar que no existe la comida para no duplicarla
    const existeComida = await Comida.findOne({
      nombreInterno: receta.title
    });

    if (existeComida) continue;

    const ingredientesArray = [];

    for (const ing of receta.extendedIngredients) {
      let ingredienteDoc = await Ingrediente.findOne({
        nombreInterno: ing.name
      });

      if (!ingredienteDoc) {
        const nombreIngredienteES = await traducirATextoES(ing.name);
        const alergiasDetectadas = await detectarAlergias(ing.name);

        const caloriasIngrediente = obtenerNutriente(
          ing.nutrition?.nutrients,
          'Calories'
        );

        const proteinasIngrediente = obtenerNutriente(
          ing.nutrition?.nutrients,
          'Protein'
        );

        const carbohidratosIngrediente = obtenerNutriente(
          ing.nutrition?.nutrients,
          'Carbohydrates'
        );

        const grasasIngrediente = obtenerNutriente(
          ing.nutrition?.nutrients,
          'Fat'
        );

        const ingredienteData = {
          nombreInterno: ing.name,
          nombreES: nombreIngredienteES,
          picIngrediente: ing.image || '',
          alergias: alergiasDetectadas
        };

        if (caloriasIngrediente > 0) {
          ingredienteData.caloriasIngrediente = caloriasIngrediente;
        }

        if (proteinasIngrediente > 0) {
          ingredienteData.proteinasIngrediente = proteinasIngrediente;
        }

        if (carbohidratosIngrediente > 0) {
          ingredienteData.carbohidratosIngrediente = carbohidratosIngrediente;
        }

        if (grasasIngrediente > 0) {
          ingredienteData.grasasIngrediente = grasasIngrediente;
        }

        ingredienteDoc = await Ingrediente.create(ingredienteData);
      }

      ingredientesArray.push({
        ingrediente: ingredienteDoc._id,
        cantidad: ing.measures?.metric?.amount || 0,
        unidad: ing.measures?.metric?.unitShort || ''
      });
    }

    const nutrients = receta.nutrition?.nutrients || [];

    const nombreES = await traducirATextoES(receta.title);

    const recetaOriginal = receta.instructions || '';
    const recetaES = recetaOriginal
      ? await traducirATextoES(recetaOriginal)
      : '';

    const caloriasTotales = obtenerNutriente(nutrients, 'Calories');
    const tipoComida = clasificarTipoComida(
      receta.dishTypes || [],
      caloriasTotales
    );

    await Comida.create({
      nombreInterno: receta.title,
      nombreES: nombreES,

      calorias: obtenerNutriente(nutrients, 'Calories'),
      proteinas: obtenerNutriente(nutrients, 'Protein'),
      carbohidratos: obtenerNutriente(nutrients, 'Carbohydrates'),
      grasas: obtenerNutriente(nutrients, 'Fat'),

      imagen: receta.image || '',

      recetaInterna: recetaOriginal,
      recetaES: recetaES,

      minCocina: receta.readyInMinutes || 0,
      segCocina: 0,

      tipoComida: tipoComida,

      ingredientes: ingredientesArray
    });
  }

  return { message: 'Base de datos poblada correctamente' };
}

module.exports = {
  poblarDesdeSpoonacular
};