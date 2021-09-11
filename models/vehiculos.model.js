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
    id_vendedor: {type: Schema.Types.ObjectId, ref:"usuario"},
    id_admin: {type: Schema.Types.ObjectId, ref:"usuario"},
    id_tipo_combustible: {type: Schema.Types.ObjectId, ref:"tipo_combustible"},
    id_Modelo: {type: Schema.Types.ObjectId, ref:"modelos"}
});

module.exports = mongoose.model('vehiculos', vehiculosSchema);