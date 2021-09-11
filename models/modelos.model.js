'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelosSchema = Schema({
    nombreM: String,
    id_Marca: {type: Schema.Types.ObjectId, ref:"marcas"}
});

module.exports = mongoose.model('modelos', modelosSchema);