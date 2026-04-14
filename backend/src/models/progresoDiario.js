const mongoose = require('mongoose');

const progresoDiarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  fecha: {
    type: String,
    required: true
  },

  comidasHechas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comida'
  }],

  caloriasConsumidas: {
    type: Number,
    default: 0
  },

  proteinasConsumidas: {
    type: Number,
    default: 0
  },

  carbohidratosConsumidos: {
    type: Number,
    default: 0
  },

  grasasConsumidas: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false
});

progresoDiarioSchema.index({ usuario: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model('ProgresoDiario', progresoDiarioSchema);