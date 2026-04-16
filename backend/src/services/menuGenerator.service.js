function penalizacion(real, objetivo, pesoBase = 1, pesoExceso = 2, pesoDefecto = 1) {
  if (!objetivo || objetivo <= 0) return 0;

  const diff = real - objetivo;
  const proporcion = Math.abs(diff) / objetivo;

  if (diff > 0) {
    return proporcion * pesoBase * pesoExceso;
  }

  return proporcion * pesoBase * pesoDefecto;
}

function calcularScoreMacros(real, objetivo) {
  const scoreCal = penalizacion(
    real.calorias, objetivo.caloriasObjetivo, 5, 1.8, 3.2);

  const scoreProt = penalizacion(
    real.proteinas, objetivo.proteinasObjetivo, 3, 1.3, 2);

  const scoreCarb = penalizacion(
    real.carbohidratos, objetivo.carbohidratosObjetivo, 3, 1.2, 2.4);

  const scoreFat = penalizacion(
    real.grasas, objetivo.grasasObjetivo, 4, 2.8, 1);

  return scoreCal + scoreProt + scoreCarb + scoreFat;
}

function esCandidatoValido(macros, objetivos) {
  if (macros.calorias < objetivos.caloriasObjetivo * 0.80) return false;
  if (macros.calorias > objetivos.caloriasObjetivo * 1.12) return false;
  if (macros.grasas > objetivos.grasasObjetivo * 1.45) return false;
  if (macros.proteinas < objetivos.proteinasObjetivo * 0.75) return false;
  if (macros.carbohidratos < objetivos.carbohidratosObjetivo * 0.70) return false;

  return true;
}

function scoreComidaParaObjetivo(comida) {
  const calorias = comida.calorias || 0;
  const proteinas = comida.proteinas || 0;
  const carbohidratos = comida.carbohidratos || 0;
  const grasas = comida.grasas || 0;

  return (
    carbohidratos * 3 +
    proteinas * 2 +
    calorias * 0.4 -
    grasas * 3.5
  );
}

function elegirMejorAleatorio(lista, usadasGlobal, topN = 25) {
  if (!lista || lista.length === 0) return null;

  let disponibles = lista.filter(c => !usadasGlobal.has(c._id.toString()));

  if (disponibles.length === 0) {
    disponibles = lista;
  }

  const ordenadas = [...disponibles].sort(
    (a, b) => scoreComidaParaObjetivo(b) - scoreComidaParaObjetivo(a)
  );

  const candidatas = ordenadas.slice(0, Math.min(topN, ordenadas.length));

  const seleccion = candidatas[Math.floor(Math.random() * candidatas.length)];

  if (!seleccion) return null;

  usadasGlobal.add(seleccion._id.toString());

  return seleccion;
}

function elegirMejorSnack(
  listaSnacks,
  usadasGlobal,
  caloriasRestantes,
  carbosRestantes,
  proteinasRestantes,
  grasasRestantes
) {
  if (!listaSnacks || listaSnacks.length === 0) return null;

  let disponibles = listaSnacks.filter(c => !usadasGlobal.has(c._id.toString()));
  if (disponibles.length === 0) {
    disponibles = listaSnacks;
  }

  let mejorSnack = null;
  let mejorScore = Infinity;

  for (const snack of disponibles) {
    const scoreCal =
      Math.abs((snack.calorias || 0) - Math.max(0, caloriasRestantes)) /
      Math.max(1, caloriasRestantes || 1);

    const scoreCarb =
      Math.abs((snack.carbohidratos || 0) - Math.max(0, carbosRestantes)) /
      Math.max(1, carbosRestantes || 1);

    const scoreProt =
      Math.abs((snack.proteinas || 0) - Math.max(0, proteinasRestantes)) /
      Math.max(1, proteinasRestantes || 1);

    const grasaSnack = snack.grasas || 0;
    const scoreFat =
      grasasRestantes <= 0
        ? grasaSnack * 2
        : Math.abs(grasaSnack - grasasRestantes) /
          Math.max(1, grasasRestantes || 1);

    const scoreTotal = scoreCal * 3 + scoreCarb * 3 + scoreProt * 2 + scoreFat * 4;

    if (scoreTotal < mejorScore) {
      mejorScore = scoreTotal;
      mejorSnack = snack;
    }
  }

  if (mejorSnack) {
    usadasGlobal.add(mejorSnack._id.toString());
  }

  return mejorSnack;
}

function calcularMacrosDia(dia, comidasMap) {
  const comidas = [
    dia.desayuno ? comidasMap[dia.desayuno.toString()] : null,
    dia.comida ? comidasMap[dia.comida.toString()] : null,
    dia.cena ? comidasMap[dia.cena.toString()] : null,
    dia.snack ? comidasMap[dia.snack.toString()] : null
  ].filter(Boolean);

  return comidas.reduce(
    (acc, c) => {
      acc.calorias += c.calorias || 0;
      acc.proteinas += c.proteinas || 0;
      acc.carbohidratos += c.carbohidratos || 0;
      acc.grasas += c.grasas || 0;
      return acc;
    },
    {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    }
  );
}

function generarDiaCandidato(comidasPorTipo, objetivos, comidasMap, usadasGlobal) {
  const desayuno = elegirMejorAleatorio(comidasPorTipo.desayuno, usadasGlobal);
  const comida = elegirMejorAleatorio(comidasPorTipo.comida, usadasGlobal);
  const cena = elegirMejorAleatorio(comidasPorTipo.cena, usadasGlobal);

  const parcial = {
    desayuno: desayuno?._id || null,
    comida: comida?._id || null,
    cena: cena?._id || null,
    snack: null
  };

  const macrosParciales = calcularMacrosDia(parcial, comidasMap);

  const caloriasRestantes = objetivos.caloriasObjetivo - macrosParciales.calorias;
  const carbosRestantes = objetivos.carbohidratosObjetivo - macrosParciales.carbohidratos;
  const proteinasRestantes = objetivos.proteinasObjetivo - macrosParciales.proteinas;
  const grasasRestantes = objetivos.grasasObjetivo - macrosParciales.grasas;

  const snack = elegirMejorSnack(
    comidasPorTipo.snack,
    usadasGlobal,
    caloriasRestantes,
    carbosRestantes,
    proteinasRestantes,
    grasasRestantes
  );

  return {
    desayuno: desayuno?._id || null,
    comida: comida?._id || null,
    cena: cena?._id || null,
    snack: snack?._id || null
  };
}

function generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal, intentos = 1000) {
  let mejorDia = null;
  let mejorScore = Infinity;

  for (let i = 0; i < intentos; i++) {
    const usadasTemp = new Set(usadasGlobal);

    const candidato = generarDiaCandidato(comidasPorTipo, objetivos, comidasMap, usadasTemp);
    const macros = calcularMacrosDia(candidato, comidasMap);

    if (!esCandidatoValido(macros, objetivos)) {
      continue;
    }

    const score = calcularScoreMacros(macros, objetivos);

    if (score < mejorScore) {
      mejorScore = score;
      mejorDia = candidato;
    }
  }

  if (!mejorDia) {
    for (let i = 0; i < Math.max(200, Math.floor(intentos / 2)); i++) {
      const usadasTemp = new Set(usadasGlobal);

      const candidato = generarDiaCandidato(comidasPorTipo, objetivos, comidasMap, usadasTemp);
      const macros = calcularMacrosDia(candidato, comidasMap);
      const score = calcularScoreMacros(macros, objetivos);

      if (score < mejorScore) {
        mejorScore = score;
        mejorDia = candidato;
      }
    }
  }

  if (!mejorDia) {
    const usadasTemp = new Set(usadasGlobal);
    mejorDia = generarDiaCandidato(comidasPorTipo, objetivos, comidasMap, usadasTemp);
  }

  Object.values(mejorDia).forEach(id => {
    if (id) usadasGlobal.add(id.toString());
  });

  const macrosFinales = calcularMacrosDia(mejorDia, comidasMap);

  return {
    ...mejorDia,
    caloriasTotales: macrosFinales.calorias,
    macrosTotales: {
      proteinas: macrosFinales.proteinas,
      carbohidratos: macrosFinales.carbohidratos,
      grasas: macrosFinales.grasas
    }
  };
}

function generarMenuSemanal(comidasPorTipo, objetivos, comidasMap) {
  const usadasGlobal = new Set();

  return {
    lunes: generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal),
    martes: generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal),
    miercoles: generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal),
    jueves: generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal),
    viernes: generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal),
    sabado: generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal),
    domingo: generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal)
  };
}

module.exports = {
  generarMenuSemanal
};