'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rolesSchema = Schema ({
    nombreRol: String,
    descripcion: String,
    roleKey: Number
});

module.exports = mongoose.model('roles', rolesSchema);