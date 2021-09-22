'use strict'

// IMPORTACIONES
var express = require('express');
var usuarioController = require('../controllers/usuario.controller');

// IMPORTACION MIDDLEWARES PARA RUTAS
var mdAuth = require('../middlewares/authenticated');

// RUTAS
var api = express.Router();

api.post('/saveUser', mdAuth.ensureAuth, usuarioController.saveUser);
api.post('/Login', usuarioController.Login);
api.get('/getUsers', mdAuth.ensureAuth,usuarioController.getUsers);
api.get('/getUserID', mdAuth.ensureAuth,usuarioController.getUserID);
api.put('/updateUser', usuarioController.updateUser);
api.post('/search', mdAuth.ensureAuth,usuarioController.search);
api.put('/DeleteUser', mdAuth.ensureAuth,usuarioController.DeleteUser);


// EXPORTAR
module.exports = api;
