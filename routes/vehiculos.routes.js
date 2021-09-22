'use strict'

// IMPORTACIONES
var express = require('express');
var vehiculosController = require('../controllers/vehiculos.controller');

// IMPORTACION MIDDLEWARES PARA RUTAS
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './img/vehiculos'});

// RUTAS
var api = express.Router();

api.put('/uploadImage/:id', [mdAuth.ensureAuth,mdUpload], vehiculosController.uploadImage);
api.get('/getImage/:fileName', [mdUpload] ,vehiculosController.getImage);
api.post('/registarVehiculo', mdAuth.ensureAuth, vehiculosController.registarVehiculo);




// EXPORTAR
module.exports = api;
