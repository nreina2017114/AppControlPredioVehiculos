'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var usuarioSchema = Schema ({
    nombreU: String,
    usuario: String,
    email: String,
    password: String,
    telefono: Number,
    DPI: String,
    rol: String,
    id_rol: String
})

module.exports = mongoose.model('usuario', usuarioSchema);