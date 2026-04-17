const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

const usuarioRoutes = require('./src/routes/usuarios.routes');
const alergiaRoutes = require('./src/routes/alergias.routes');
const ingredienteRoutes = require('./src/routes/ingredientes.routes');
const comidaRoutes = require('./src/routes/comidas.routes');
const spoonacularRoutes = require('./src/routes/spoonacular');
const menuRoutes = require('./src/routes/menu.routes');
const progresoRoutes = require('./src/routes/progreso.routes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, './src/uploads')));

// Rutas usuarios
app.use('/api/usuarios', usuarioRoutes);

// Rutas alergias
app.use('/api/alergias', alergiaRoutes);

// Rutas ingredientes
app.use('/api/ingredientes', ingredienteRoutes);

// Rutas comidas
app.use('/api/comidas', comidaRoutes);

// Rutas spoonacular
app.use('/api/spoonacular', spoonacularRoutes);

// Rutas menú
app.use('/api/menu', menuRoutes);

// Rutas progreso diario
app.use('/api/progreso', progresoRoutes);

module.exports = app;