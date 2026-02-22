const mongoose = require('mongoose');

const IngredienteSchema = new mongoose.Schema({

  nombreInterno: {
    type: String,
    required: true,
    unique: true
  },

  nombreES: {
    type: String,
    required: true
  },

  caloriasIngrediente: Number,
  proteinasIngrediente: Number,
  carbohidratosIngrediente: Number,
  grasasIngrediente: Number,

  picIngrediente: String,

  alergias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alergia'
  }]
}, {
  versionKey: false,
});

module.exports = mongoose.model('Ingrediente', IngredienteSchema);