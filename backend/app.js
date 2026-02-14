const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', require('./src/routes/usuarios.routes'));

module.exports = app;