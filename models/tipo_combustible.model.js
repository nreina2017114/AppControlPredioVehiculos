'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tipo_combustibleSchema = Schema ({
    nombreC: String
});

module.exports = mongoose.model('tipo_combustible', tipo_combustibleSchema);