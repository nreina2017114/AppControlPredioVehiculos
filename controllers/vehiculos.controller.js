'use strict'

var User = require('../models/usuario.model');
var Vehiculo = require('../models/vehiculos.model');
var jwt = require('../services/jwt');



var fs = require('fs');
var path = require('path');



function uploadImage(req, res){
    var userId = req.params.id;
    var fileName = 'Sin imagen';

    if(userId != req.user.sub){
        res.status(403).send({mensaje: 'No tienes permisos'});
    }else{
        if(req.files){
            //captura la ruta de la imagen
            var filePath = req.files.image.path;
            //separa en indices cada carpeta
            //si se trabaja en linux ('\');
            var fileSplit = filePath.split('\\');
            //captura el nombre de la imagen
            var fileName = fileSplit[2];

            var ext = fileName.split('\.');
            var fileExt = ext[1];

            if( fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    Vehiculo.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, vehiculoUpdated)=>{
                        if(err){
                            return res.status(500).send({mensaje: 'Error general'});
                        }else if(vehiculoUpdated){
                            return res.send({usuario: vehiculoUpdated, vehiculoImage: vehiculoUpdated.image});
                        }else{
                            return res.status(404).send({mensaje: 'No se actualizó'});
                        }
                    })
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            return res.status(500).send({mensaje: 'Error al eliminar y la extensión no es válida'});
                        }else{
                            return res.status(403).send({mensaje: 'Extensión no válida, y archivo eliminado'});
                        }
                    })
                }
        }else{
            return res.status(404).send({mensaje: 'No has subido una imagen'});
        }
    }
}

function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './img/vehiculos/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({mensaje: 'Imagen inexistente'});
        }
    })
}


module.exports = {
    uploadImage,
    getImage
}