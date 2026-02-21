const mongoose = require('mongoose');

const AlergiaSchema = new mongoose.Schema({
  nombreAlergia: {
    type: String,
    required: true,
    unique: true
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Alergia', AlergiaSchema);