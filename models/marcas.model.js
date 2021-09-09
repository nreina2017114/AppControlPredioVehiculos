'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marcasSchema = Schema({
    nombre: String
});

module.exports = mongoose.model('marcas', marcasSchema);