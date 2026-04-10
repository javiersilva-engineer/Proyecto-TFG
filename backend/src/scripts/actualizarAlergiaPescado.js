const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Ingrediente = require('../models/ingrediente');
const Alergia = require('../models/alergia');

const palabrasFish = [
  'fish',
  'salmon',
  'tuna',
  'cod',
  'hake',
  'sardine',
  'anchovy',
  'trout',
  'mackerel',
  'sea bass',
  'bream'
];

async function actualizarAlergiaPescado() {
  await mongoose.connect(process.env.MONGO_URI);

  const alergiaFish = await Alergia.findOne({ nombreEN: 'fish' });

  if (!alergiaFish) {
    throw new Error('No existe la alergia "fish" en la base de datos. Ejecuta antes el script de poblado de alergias.');
  }

  const ingredientes = await Ingrediente.find();

  let actualizados = 0;

  for (const ingrediente of ingredientes) {
    const nombre = (ingrediente.nombreInterno || '').toLowerCase();

    const esPescado = palabrasFish.some(palabra => nombre.includes(palabra));

    if (!esPescado) continue;

    const yaTieneAlergia = ingrediente.alergias.some(
      id => id.toString() === alergiaFish._id.toString()
    );

    if (!yaTieneAlergia) {
      ingrediente.alergias.push(alergiaFish._id);
      await ingrediente.save();
      actualizados++;
    }
  }

  console.log(`Ingredientes actualizados con alergia de pescado: ${actualizados}`);
  process.exit();
}

actualizarAlergiaPescado().catch(err => {
  console.error(err);
  process.exit(1);
});