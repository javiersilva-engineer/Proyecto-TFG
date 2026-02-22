const mongoose = require('mongoose');

const comidaSchema = new mongoose.Schema({

  nombreInterno: {
    type: String,
    required: true,
    unique: true
  },

  nombreES: {
    type: String,
    required: true
  },

  calorias: Number,
  proteinas: Number,
  carbohidratos: Number,
  grasas: Number,

  imagen: String,

  recetaInterna: String,
  recetaES: String,

  minCocina: Number,
  segCocina: Number,

  tipoComida: {
    type: [String],
    enum: ['desayuno', 'comida', 'cena', 'snack'],
    default: []
  },

  ingredientes: [
    {
      ingrediente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingrediente',
        required: true
      },
      cantidad: Number,
      unidad: String
    }
  ]
}, {
  versionKey: false,
});

module.exports = mongoose.model('Comida', comidaSchema);