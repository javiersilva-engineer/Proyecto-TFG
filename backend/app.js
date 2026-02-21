const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const usuarioRoutes = require('./src/routes/usuarios.routes');
const alergiaRoutes = require('./src/routes/alergias.routes');
const ingredienteRoutes = require('./src/routes/ingredientes.routes');
const comidaRoutes = require('./src/routes/comidas.routes');
const spoonacularRoutes = require('./src/routes/spoonacular');




const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Rutas usuarios
app.use('/api/usuarios', usuarioRoutes);

// Rutas alergias
app.use('/api/alergias', alergiaRoutes);

// Rutas ingredientes
app.use('/api/ingredientes', ingredienteRoutes);

// Rutas comidas
app.use('/api/comidas', comidaRoutes);

//Rutas spoonacular
app.use('/api/spoonacular', spoonacularRoutes);

module.exports = app;