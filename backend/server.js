const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const usuariosRouter = require('./routes/usuarios');
const recetasRouter = require('./routes/recetas');
const ingredientesRouter = require('./routes/ingredientes');
const alergenosRouter = require('./routes/alergenos');
const recetaIngredienteRouter = require('./routes/receta_ingrediente');

app.use('/usuarios', usuariosRouter);
app.use('/recetas', recetasRouter);
app.use('/ingredientes', ingredientesRouter);
app.use('/alergenos', alergenosRouter);
app.use('/receta_ingrediente', recetaIngredienteRouter);

// Ruta de test
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando!' });
});

app.listen(3000, () => console.log('Server running on port 3000'));