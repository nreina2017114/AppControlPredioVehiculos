'use strict'

var Usuario = require('../models/usuario.model');
var Vehiculo = require('../models/vehiculos.model');

var fs = require('fs');
var path = require('path');



function uploadImage(req, res){
    var vehiculoId = req.params.id;
    var fileName = 'Sin imagen';

   
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
                    Vehiculo.findByIdAndUpdate(vehiculoId, {image: fileName}, {new:true}, (err, vehiculoUpdated)=>{
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


function registarVehiculo(req, res){
    var body = req.body;
    var vehiculo = new Vehiculo();

    if(req.user.rol == "ROL_ADMIN"){
        if(body.ubicacion){
            Vehiculo.findOne({ubicacion: body.ubicacion}, (err, ubicacionRepeat)=>{
                if(err){
                    res.status(500).send({mensaje:"Error general del servidor 1"});
                }else if(ubicacionRepeat){
                    res.status(400).send({mensaje:"Ubicacion ya existente"});
                }else{
                    vehiculo.image = body.image;
                    vehiculo.año = body.año;
                    vehiculo.color = body.color;
                    vehiculo.precio = body.precio;
                    vehiculo.ubicacion = body.ubicacion;
                    vehiculo.motor = body.motor;
                    vehiculo.cilindros = body.cilindros;
                    vehiculo.puertas = body.puertas;
                    vehiculo.caracteristicas = body.caracteristicas;

                    
                    vehiculo.save((err, vehiculoSave)=>{
                        if(err){
                            return res.status(500).send({mensaje:"Error general del servidor 2"});
                        }else if(vehiculoSave){
                            return res.send({Vehiculo_Nuevo: vehiculoSave});
                        }else{
                            return res.status(400).send({mensaje:"No se pudo registrar el Vehiculo"});
                        }
                    });
                }
            });
        }else{
            res.status(404).send({mensaje:"Ingrese el vehiculo que decea agregar"});
        }
    }else{
        res.status(404).send({mensaje:"No tiene permisos para esta ruta"});
    }
}


// ----------------------------------------------------------------------------------------------------------------
function getVehicles(req, res){
    Vehiculo.find().exec((err, vehicles) => {
        if(err){
            return res.status(500).send({mensaje: "Error al buscar los vehiculos"})
        }else if(vehicles){
            console.log(vehicles)
            return res.send({mensaje: "vehiculos encontrados correctamente", vehicles})
        }else{
            return res.status(204).send({mensaje: "No se encontro ningun Vehiculo"})
        }
    });
}



// ----------------------------------------------------------------------------------------------------------------
function getVehicleID(req, res) {
    var VehiculoId = req.params.vehiculoId;
 
    Vehiculo.findById(VehiculoId, (err, vehiculoEncontrado) => {
    if(err){
        return res.status(500).send({ mensaje: 'Error en la peticion del Vehiculo' });
    }else if(vehiculoEncontrado){
        console.log(vehiculoEncontrado)
        return res.status(200).send({mensaje:"El Vehiculo ha sido encontrado exitosamente" ,vehiculoEncontrado });
    }else{
        return res.status(500).send({ mensaje: 'Error al obtener el Vehiculo.'});
       }
   });
 }
    


// ----------------------------------------------------------------------------------------------------------------
function updateVehicle(req, res){
    var idVehicle = req.params.id;
    var update = req.body; 

    if(req.user.rol !="ROL_ADMIN"){
        res.status(403).send({mensaje:"No tienes permisos para esta ruta"});
    }else{
        Vehiculo .findOne({ubicacion:update.ubicacion},(err, vehiculoRepeat)=>{
            if(err){
                res.status(500).send({mensaje:"Error general en el servidor ",err});
            }else if(vehiculoRepeat){
                res.status(403).send({mensaje:"No puede actualizar su ubicacion porque no puede ser la misma"});
            }else{
                Vehiculo.findByIdAndUpdate(idVehicle, update, {new:true},(err,updateVehiculo) =>{
                    if(err){
                        res.status(500).send({mensaje:"Error en el servidor ", err});
                    }else if(updateVehiculo){
                        res.send({Vehiculo_Actualizado: updateVehiculo});
                    }else{
                        res.status(404).send({mensaje:"El Vehiculo que quiere actualizar no existe"});
                    }
                });
            }
        });
    }
}



// ---------------------------------------------------------------------------------------------------------------
function DeleteVehicle(req, res){
    var idVehicle = req.params.id;

    if(idVehicle != req.user.sub){
        res.status(403).send({message:"Error de permisos para esta ruta"});
        console.log(req.user.sub)
    }else{
        Vehiculo.findByIdAndRemove(idVehicle,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(deleted){
                res.send({message: "Vehiculo Eliminado Correctamente",deleted});
            }else{
                res.status(404).send({message: "No ha indicado el vehiculo que quiere eliminar"});
            }
        });
    }
    
}



// ----------------------------------------------------------------------------------------------------------------
function search(req, res){
    var params = req.body;

    if(params.search){
        Usuario.find({$or:[{precio: params.search},
                {año: params.search}]}, (err, resultsSearch)=>{
                            if(err){
                                return res.status(500).send({mensaje: 'Error general'})
                            }else if(resultsSearch){
                                return res.send({resultsSearch})
                            }else{
                                return res.status(404).send({mensaje: 'No hay registros para mostrar'})
                            }
                        })
         }else{
        return res.status(403).send({mensaje: 'Ingresa algún dato en el campo de búsqueda'})
    }
}



module.exports = {
    uploadImage,
    getImage,
    registarVehiculo,
    getVehicles,
    getVehicleID,
    updateVehicle,
    DeleteVehicle,
    search
}