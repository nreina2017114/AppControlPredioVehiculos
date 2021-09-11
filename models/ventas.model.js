'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ventasSchema = Schema({
    fecha: Date,
    id_Vehiculo: {type: Schema.Types.ObjectId, ref:"vehiculos"},
    id_Comprador: {type: Schema.Types.ObjectId, ref:"usuario"}
});

module.exports = mongoose.model('ventas', ventasSchema);