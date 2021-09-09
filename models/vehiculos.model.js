'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vehiculosSchema = Schema({
    imagen: String,
    año: Date,
    color: String,
    precio: Number,
    ubicacion: String,
    motor: String,
    cilindros: String,
    puertas: Number,
    caracteristicas: String,
    id_vendedor: String,
    id_admin: {type: Schema.ObjectId, ref:"usuario"},
    id_tipo_combustible: String,
    idModelo: String
});

module.exports = mongoose.model('vehiculos', vehiculosSchema);