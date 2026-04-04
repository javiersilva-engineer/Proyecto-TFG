const FACTOR_ACTIVIDAD = {
  0: 1.2,    // Sedentario
  1: 1.375,  // Ligero
  2: 1.55,   // Moderado
  3: 1.725,  // Alto
  4: 1.9     // Muy alto
};

function calcularTMB({ sexo, peso, altura, edad }) {
  // Hombre
  if (sexo === 1) {
    return (10 * peso) + (6.25 * altura) - (5 * edad) + 5;
  }

  // Mujer
  if (sexo === 0) {
    return (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
  }

  throw new Error('Sexo no válido');
}


function calcularObjetivos(usuario) {
  const {
    peso,
    altura,
    edad,
    sexo,
    ejercicio,
    pesoObjetivo
  } = usuario;

  // TMB
  const tmb = calcularTMB({ sexo, peso, altura, edad });

  // TDEE
  const factorActividad = FACTOR_ACTIVIDAD[ejercicio] || 1.2;
  let calorias = tmb * factorActividad;

  // Determinar objetivo
  let objetivo = 'mantener';

  if (pesoObjetivo) {
    if (pesoObjetivo > peso) objetivo = 'subir';
    if (pesoObjetivo < peso) objetivo = 'bajar';
  }

  // Ajuste calórico
  if (objetivo === 'subir') calorias += 300;
  if (objetivo === 'bajar') calorias -= 400;

  calorias = Math.round(calorias);

  // Proteínas
  const proteinasPorKg = objetivo === 'bajar' ? 2.2 : 2;
  const proteinas = Math.round(peso * proteinasPorKg);
  const kcalProteinas = proteinas * 4;

  // Grasas
  const grasas = Math.round(peso * 0.9);
  const kcalGrasas = grasas * 9;

  // Carbohidratos
  const kcalRestantes = calorias - (kcalProteinas + kcalGrasas);
  const carbohidratos = Math.round(kcalRestantes / 4);

  return {
    caloriasObjetivo: calorias,
    proteinasObjetivo: proteinas,
    carbohidratosObjetivo: carbohidratos,
    grasasObjetivo: grasas
  };
}

module.exports = { calcularObjetivos };