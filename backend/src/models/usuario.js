const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  altura: Number,
  peso: Number,
  edad: Number,
  ejercicio: Number,
  sexo: Number,

  pesoObjetivo: {
    type: Number,
    default: null
  },
  caloriasObjetivo: {
    type: Number,
    default: null
  },
  proteinasObjetivo: {
    type: Number,
    default: null
  },
  carbohidratosObjetivo: {
    type: Number,
    default: null
  },
  grasasObjetivo: {
    type: Number,
    default: null
  },

  alergenos: {
    type: [String],
    default: []
  }

}, {
  versionKey: false
});

module.exports = mongoose.model('Usuario', UsuarioSchema);