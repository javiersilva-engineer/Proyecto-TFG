function calcularObjetivoComida(objetivos, porcentaje) {
  return {
    calorias: objetivos.caloriasObjetivo * porcentaje,
    proteinas: objetivos.proteinasObjetivo * porcentaje,
    carbohidratos: objetivos.carbohidratosObjetivo * porcentaje,
    grasas: objetivos.grasasObjetivo * porcentaje
  };
}

function calcularScoreMacros(real, objetivo) {
  const diffCal = Math.abs(real.calorias - objetivo.caloriasObjetivo);
  const diffProt = Math.abs(real.proteinas - objetivo.proteinasObjetivo);
  const diffCarb = Math.abs(real.carbohidratos - objetivo.carbohidratosObjetivo);
  const diffFat = Math.abs(real.grasas - objetivo.grasasObjetivo);

  return diffCal + diffProt * 4 + diffCarb * 2 + diffFat * 3;
}

function elegirAleatorio(lista, usadasGlobal) {
  const disponibles = lista.filter(c => !usadasGlobal.has(c._id.toString()));

  if (disponibles.length === 0) return null;

  const seleccion = disponibles[Math.floor(Math.random() * disponibles.length)];

  usadasGlobal.add(seleccion._id.toString());

  return seleccion;
}

function calcularMacrosDia(dia, comidasMap) {
  const comidas = [
    comidasMap[dia.desayuno],
    comidasMap[dia.comida],
    comidasMap[dia.cena],
    comidasMap[dia.snack]
  ].filter(Boolean);

  return comidas.reduce((acc, c) => {
    acc.calorias += c.calorias || 0;
    acc.proteinas += c.proteinas || 0;
    acc.carbohidratos += c.carbohidratos || 0;
    acc.grasas += c.grasas || 0;
    return acc;
  }, {
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });
}

function generarDiaCandidato(comidasPorTipo, usadasGlobal) {

  const desayuno = elegirAleatorio(comidasPorTipo.desayuno, usadasGlobal);
  const comida = elegirAleatorio(comidasPorTipo.comida, usadasGlobal);
  const cena = elegirAleatorio(comidasPorTipo.cena, usadasGlobal);
  const snack = elegirAleatorio(comidasPorTipo.snack, usadasGlobal);

  return {
    desayuno: desayuno?._id,
    comida: comida?._id,
    cena: cena?._id,
    snack: snack?._id
  };
}

function generarMejorDia(comidasPorTipo, objetivos, comidasMap, usadasGlobal, intentos = 50) {

  let mejorDia = null;
  let mejorScore = Infinity;

  for (let i = 0; i < intentos; i++) {

    // usamos un set temporal para no contaminar el global en cada intento
    const usadasTemp = new Set(usadasGlobal);

    const candidato = generarDiaCandidato(comidasPorTipo, usadasTemp);

    const macros = calcularMacrosDia(candidato, comidasMap);

    const score = calcularScoreMacros(macros, objetivos);

    if (score < mejorScore) {
      mejorScore = score;
      mejorDia = candidato;
    }
  }

  // 🔥 ahora sí añadimos las comidas elegidas al global
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