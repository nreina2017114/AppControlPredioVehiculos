'use strict'

// IMPORTACIONES
var express = require('express');
var usuarioController = require('../controllers/usuario.controller');

// IMPORTACION MIDDLEWARES PARA RUTAS
var mdAuth = require('../middlewares/authenticated');

// RUTAS
var api = express.Router();

api.post('/login', usuarioController.login);


// EXPORTAR
module.exports = api;
