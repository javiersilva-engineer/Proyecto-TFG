const mongoose = require('mongoose');

const AlergiaSchema = new mongoose.Schema({
  nombreES: {
    type: String,
    required: true,
    unique: true
  },
  nombreEN: {
    type: String,
    required: true,
    unique: true
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Alergia', AlergiaSchema);