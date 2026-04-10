const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Alergia = require('../models/alergia');

const ALERGIAS = [
  { nombreES: 'Gluten', nombreEN: 'gluten' },
  { nombreES: 'Crustáceos', nombreEN: 'crustaceans' },
  { nombreES: 'Pescado', nombreEN: 'fish' },
  { nombreES: 'Lácteos', nombreEN: 'dairy' },
  { nombreES: 'Mostaza', nombreEN: 'mustard' },
  { nombreES: 'Huevos', nombreEN: 'eggs' },
  { nombreES: 'Soja', nombreEN: 'soy' },
  { nombreES: 'Cacahuetes', nombreEN: 'peanuts' },
  { nombreES: 'Frutos secos', nombreEN: 'tree nuts' },
  { nombreES: 'Sésamo', nombreEN: 'sesame' },
  { nombreES: 'Apio', nombreEN: 'celery' },
  { nombreES: 'Moluscos', nombreEN: 'mollusks' }
];

async function poblarAlergias() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const alergia of ALERGIAS) {
    await Alergia.findOneAndUpdate(
      { nombreEN: alergia.nombreEN },
      alergia,
      { upsert: true }
    );
  }

  console.log('Alergias pobladas correctamente');
  process.exit();
}

poblarAlergias();