'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rolesSchema = Schema ({
    nombreRol: String,
    descripcion: String
[
    {
        id:1,
        nombreRol: String,
        descripcion: String
    }
]

});

module.exports = mongoose.model('roles', rolesSchema);