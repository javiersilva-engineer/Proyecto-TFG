const mongoose = require('mongoose');

const menuDiaSchema = new mongoose.Schema({
  desayuno: { type: mongoose.Schema.Types.ObjectId, ref: 'Comida' },
  comida:   { type: mongoose.Schema.Types.ObjectId, ref: 'Comida' },
  cena:     { type: mongoose.Schema.Types.ObjectId, ref: 'Comida' },
  snack:    { type: mongoose.Schema.Types.ObjectId, ref: 'Comida' },

  caloriasTotales: Number,
  macrosTotales: {
    proteinas: Number,
    carbohidratos: Number,
    grasas: Number
  }
}, { _id: false });

const menuSemanalUsuarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true
  },

  lunes: menuDiaSchema,
  martes: menuDiaSchema,
  miercoles: menuDiaSchema,
  jueves: menuDiaSchema,
  viernes: menuDiaSchema,
  sabado: menuDiaSchema,
  domingo: menuDiaSchema,

  objetivos: {
    caloriasDiarias: Number,
    proteinas: Number,
    carbohidratos: Number,
    grasas: Number
  },

  alergiasAplicadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alergia'
  }],
});

module.exports = mongoose.model('MenuSemanalUsuario', menuSemanalUsuarioSchema);