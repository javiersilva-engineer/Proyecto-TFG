const mongoose = require('mongoose');

const IngredienteSchema = new mongoose.Schema({
  nombreIngrediente: {
    type: String,
    required: true
  },
  caloriasIngrediente: Number,
  proteinasIngrediente: Number,
  carbohidratosIngrediente: Number,
  grasasIngrediente: Number,

  picIngrediente: String, // URL o path de la imagen

  alergias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alergia'
  }]
}, {
  versionKey: false
});

module.exports = mongoose.model('Ingrediente', IngredienteSchema);