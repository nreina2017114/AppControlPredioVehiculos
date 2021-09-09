'use strict'

// VARIABLES GLOBALES
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// IMPORTACION DE RUTAS


// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CABECERAS
app.use(cors());


// APLICACION DE RUTAS  localhost:3000/api/ejemplos


// EXPORTAR
module.exports = app;


