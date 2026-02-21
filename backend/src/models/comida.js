const mongoose = require('mongoose');

const ComidaSchema = new mongoose.Schema({
  nombreComida: {
    type: String,
    required: true
  },

  caloriasComida: Number,
  proteinasComida: Number,
  carbohidratosComida: Number,
  grasasComida: Number,

  picComida: String, // URL o path de la imagen
  receta: String,

  minCocina: Number,
  segCocina: Number,

  ingredientes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingrediente'
  }]
}, {
  versionKey: false
});

module.exports = mongoose.model('Comida', ComidaSchema);