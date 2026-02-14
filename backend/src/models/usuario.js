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
  sexo: Number
});

module.exports = mongoose.model('Usuario', UsuarioSchema);