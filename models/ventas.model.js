'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ventasSchema = Schema({
    fecha: Date,
    idVehiculo: String,
    idComprador: String
});

module.exports = mongoose.model('ventas', ventasSchema);