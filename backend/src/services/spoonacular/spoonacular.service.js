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

  // Clasificar por dishtypes de Spoonacular
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

/* ======================================================
   OBTENER RECETAS DE SPOONACULAR (CON NUTRICIÓN)
====================================================== */
async function obtenerRecetas(numero = 5) {
  const response = await axios.get(`${BASE_URL}/recipes/random`, {
    params: {
      number: numero,
      includeNutrition: true,
      apiKey: API_KEY
    }
  });

  return response.data.recipes || [];
}

/* ======================================================
   FUNCIÓN AUXILIAR PARA EXTRAER MACROS
====================================================== */
function obtenerNutriente(nutrients = [], nombre) {
  return nutrients.find(n => n.name === nombre)?.amount || 0;
}

/* ======================================================
   POBLAR BASE DE DATOS DESDE SPOONACULAR
====================================================== */
async function poblarDesdeSpoonacular(numero = 5) {
  const recetas = await obtenerRecetas(numero);

  for (const receta of recetas) {

    /* ==========================================
       EVITAR DUPLICAR COMIDAS
    ========================================== */
    const existeComida = await Comida.findOne({
      nombreInterno: receta.title
    });

    if (existeComida) continue;

    const ingredientesArray = [];

    /* ==========================================
       INGREDIENTES DE LA RECETA
    ========================================== */
    for (const ing of receta.extendedIngredients) {

      // /* ---------- ALERGIA ---------- */
      let alergiaDoc = null;

      // if (ing.aisle) {
      //   alergiaDoc = await Alergia.findOneAndUpdate(
      //     { nombreAlergia: ing.aisle.toLowerCase() },
      //     { nombreAlergia: ing.aisle.toLowerCase() },
      //     { upsert: true, new: true }
      //   );
      // }

      /* ---------- INGREDIENTE ---------- */
      let ingredienteDoc = await Ingrediente.findOne({
        nombreInterno: ing.name
      });

      if (!ingredienteDoc) {
        const nombreIngredienteES = await traducirATextoES(ing.name);
        const alergiasDetectadas = await detectarAlergias(ing.name);

        ingredienteDoc = await Ingrediente.create({
          nombreInterno: ing.name, // inglés (clave estable)
          nombreES: nombreIngredienteES,      // luego podrás traducir
          caloriasIngrediente: obtenerNutriente(
            ing.nutrition?.nutrients,
            'Calories'
          ),
          proteinasIngrediente: obtenerNutriente(
            ing.nutrition?.nutrients,
            'Protein'
          ),
          carbohidratosIngrediente: obtenerNutriente(
            ing.nutrition?.nutrients,
            'Carbohydrates'
          ),
          grasasIngrediente: obtenerNutriente(
            ing.nutrition?.nutrients,
            'Fat'
          ),
          picIngrediente: ing.image || '',
          alergias: alergiasDetectadas
        });
      } else if (
        alergiaDoc &&
        !ingredienteDoc.alergias.includes(alergiaDoc._id)
      ) {
        ingredienteDoc.alergias.push(alergiaDoc._id);
        await ingredienteDoc.save();
      }

      /* ---------- RELACIÓN COMIDA ↔ INGREDIENTE ---------- */
      ingredientesArray.push({
        ingrediente: ingredienteDoc._id,
        cantidad: ing.measures?.metric?.amount || 0,
        unidad: ing.measures?.metric?.unitShort || ''
      });
    }

    /* ==========================================
       MACROS DE LA COMIDA COMPLETA
    ========================================== */
    const nutrients = receta.nutrition?.nutrients || [];

    /* ==========================================
       CREAR COMIDA
    ========================================== */
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