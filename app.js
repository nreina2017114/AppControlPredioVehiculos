'use strict'

// VARIABLES GLOBALES
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// IMPORTACION DE RUTAS
var usuarioRoutes = require('./routes/usuario.routes');
var vehiculosRoutes = require('./routes/vehiculos.routes');

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CABECERAS
app.use(cors());

// APLICACION DE RUTAS  localhost:3000/api/ejemplos
app.use('/api', usuarioRoutes);
app.use('/api', vehiculosRoutes);


// EXPORTAR
module.exports = app;


