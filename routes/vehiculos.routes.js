'use strict'

// IMPORTACIONES
var express = require('express');
var vehiculosController = require('../controllers/vehiculos.controller');

// IMPORTACION MIDDLEWARES PARA RUTAS
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

// RUTAS
var api = express.Router();

api.put('/uploadImage/:id', [mdUpload], vehiculosController.uploadImage);
api.get('/getImage/:fileName', [mdUpload] ,vehiculosController.getImage);



// EXPORTAR
module.exports = api;
