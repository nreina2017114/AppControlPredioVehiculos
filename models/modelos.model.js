'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelosSchema = Schema({
    nombreM: String,
    id_Marca:[{
        nombre: String
    }]
});

module.exports = mongoose.model('modelos', modelosSchema);