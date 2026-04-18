require('dotenv').config();
const mongoose = require('mongoose');
const Ingrediente = require('../models/ingrediente');

async function limpiarCampos() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectada');

    const resultado = await Ingrediente.updateMany(
      {},
      {
        $unset: {
          caloriasIngrediente: "",
          proteinasIngrediente: "",
          carbohidratosIngrediente: "",
          grasasIngrediente: ""
        }
      }
    );

    console.log('Campos eliminados correctamente');
    console.log(resultado);

    await mongoose.disconnect();
    console.log('MongoDB desconectada');
  } catch (error) {
    console.error('Error limpiando campos:', error);
    await mongoose.disconnect();
  }
}

limpiarCampos();