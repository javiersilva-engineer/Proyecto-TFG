const MenuSemanalUsuario = require('../models/menuSemanalUsuario');
const Comida = require('../models/comida');
const Ingrediente = require('../models/ingrediente');

const { generarMenuSemanal } = require('../services/menuGenerator.service');
const { calcularObjetivos } = require('../utils/calcularMacros');

exports.generarMenu = async (usuario) => {
  const objetivos = calcularObjetivos(usuario);

  const ingredientesProhibidos = await Ingrediente.find({
    alergias: { $in: usuario.alergias }
  }).select('_id');

  const ingredientesIds = ingredientesProhibidos.map(i => i._id);

  const comidasValidas = await Comida.find({
    'ingredientes.ingrediente': { $nin: ingredientesIds }
  });

  const comidasPorTipo = {
    desayuno: comidasValidas.filter(c => c.tipoComida.includes('desayuno')),
    comida: comidasValidas.filter(c => c.tipoComida.includes('comida')),
    cena: comidasValidas.filter(c => c.tipoComida.includes('cena')),
    snack: comidasValidas.filter(c => c.tipoComida.includes('snack'))
  };

  if (
    !comidasPorTipo.desayuno.length ||
    !comidasPorTipo.comida.length ||
    !comidasPorTipo.cena.length
  ) {
    throw new Error('No hay suficientes comidas para generar el menú');
  }

  const comidasMap = {};
  comidasValidas.forEach(c => {
    comidasMap[c._id.toString()] = c;
  });

  const menuAnterior = await MenuSemanalUsuario.findOne({
    usuario: usuario._id
  });

  const menu = generarMenuSemanal(
    comidasPorTipo,
    objetivos,
    comidasMap,
    menuAnterior
  );

  return await MenuSemanalUsuario.findOneAndUpdate(
    { usuario: usuario._id },
    {
      usuario: usuario._id,
      ...menu,
      objetivos,
      alergiasAplicadas: usuario.alergias
    },
    { upsert: true, new: true }
  );
};