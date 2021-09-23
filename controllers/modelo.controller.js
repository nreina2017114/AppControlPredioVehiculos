'use strict'

var Modelo = require('../models/modelos.model');
var Marca = require('../models/marcas.model');



function IngresarModelo(req, res){
    var body = req.body;
    var modelo = new Modelo();

    if(req.user.rol == "ROL_ADMIN"){
        if(body.nombreM){

            Modelo.findOne({nombreM: body.nombreM}, (err, nombreRepeat)=>{
                if(err){
                    res.status(500).send({mensaje:"Error general del servidor 1"});
                }else if(nombreRepeat){
                    res.status(400).send({mensaje:"Nombre del modelo ya existente"});
                }else{
                    modelo.nombreM = body.nombreM;
                    

                    
                    modelo.save((err, modeloSave)=>{
                        if(err){
                            return res.status(500).send({mensaje:"Error general del servidor 2"});
                        }else if(modeloSave){
                            return res.send({Modelo_Vehiculo: modeloSave});
                        }else{
                            return res.status(400).send({mensaje:"No se pudo agregar el modelo"});
                        }
                    });
                }
                
            });
            
        }else{
            res.status(404).send({mensaje:"Ingrese el nombre del modelo que decea agregar"});
        }
    }else{
        res.status(404).send({mensaje:"No tiene permisos para esta ruta"});
    }
}


// ----------------------------------------------------------------------------------------------------------------
function getModelos(req, res){
    Modelo.find().exec((err, Modelos) => {
        if(err){
            return res.status(500).send({mensaje: "Error al buscar los modelos"})
        }else if(Modelos){
            console.log(Modelos)
            return res.send({mensaje: "Modelos Encontrados", Modelos})
        }else{
            return res.status(204).send({mensaje: "No se encontro ningun Modelos"})
        }
    });
}



// ----------------------------------------------------------------------------------------------------------------
function getModeloID(req, res) {
    var ModeloId = req.params.modeloId;
 
    Modelo.findById(ModeloId, (err, modeloEncontrado) => {
    if(err){
        return res.status(500).send({ mensaje: 'Error en la peticion del Modelo' });
    }else if(modeloEncontrado){
        console.log(modeloEncontrado)
        return res.status(200).send({mensaje:"El Modelo ha sido encontrado exitosamente" ,modeloEncontrado });
    }else{
        return res.status(500).send({ mensaje: 'Error al obtener el Modelo.'});
       }
   });
 }
    


// ----------------------------------------------------------------------------------------------------------------
function updateModelo(req, res){
    var idModelo = req.params.id;
    var update = req.body; 

    if(req.user.rol !="ROL_ADMIN"){
        res.status(403).send({mensaje:"No tienes permisos para esta ruta"});
    }else{
        Modelo .findOne({nombreM:update.nombreM},(err, nombreModeloRepeat)=>{
            if(err){
                res.status(500).send({mensaje:"Error general en el servidor ",err});
            }else if(nombreModeloRepeat){
                res.status(403).send({mensaje:"No puede actualizar su Nombre del modelo porque no puede ser la misma"});
            }else{
                Modelo.findByIdAndUpdate(idModelo, update, {new:true},(err,updateModelo) =>{
                    if(err){
                        res.status(500).send({mensaje:"Error en el servidor ", err});
                    }else if(updateModelo){
                        res.send({mensaje:"Modelo Actualizado Correctamente", updateModelo});
                    }else{
                        res.status(404).send({mensaje:"El Modelo que quiere actualizar no existe"});
                    }
                });
            }
        });
        
    }
 }




// ---------------------------------------------------------------------------------------------------------------
function DeleteModelo(req, res){
    var idModelo = req.params.id;

    if(idModelo != req.user.sub){
        res.status(403).send({message:"Error de permisos para esta ruta"});
        console.log(req.user.sub)
    }else{
        Modelo.findByIdAndRemove(idModelo,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(deleted){
                res.send({message: "Modelo Eliminado Correctamente",deleted});
            }else{
                res.status(404).send({message: "No ha indicado el Modelo que quiere eliminar"});
            }
        });
    }
    
}



// ---------------------------------------------------------------------------------------------------------------
//  Ingresar la marca del modelo //


function MeterMarca(req, res){
    let userId = req.params.id;    //Le meto a UserId la url 
    let paramsMarca = req.body;  //Le meto a paramsMarca el formulario que se esta llenando
    let marca = new Marca(); //Instancia de contactos en java script al modelo

    Modelo.findById(userId, (err, userOk) =>{
        if(err){
            res.status(500).send({err: "Error general"});
        }else if(userOk){
            if(paramsMarca.nombre){
                marca.nombre = paramsMarca.nombre;

                Modelo.findByIdAndUpdate(userId, {$push:{id_Marca: marca}},{new: true}, (err, ModeloUpdate) =>{
                    if(err){
                        res.status(500).send({err: "Error del servidor"});
                    }else if(ModeloUpdate){
                        res.status(200).send({mensaje:"Se agrego la marca al modelo Correctamente", ModeloUpdate});
                    }else{
                        res.status(404).send({message: "No se a podido actualizar"});
                    }
                })
            }else{
                res.status(200).send({message: "Ingrese los parametros necesarios"})
            }

        }else{
            res.status(404).send({message: "Modelo Inexistente"})
        }
    })
}

module.exports = {
    IngresarModelo,
    getModelos,
    getModeloID,
    updateModelo,
    DeleteModelo,
    MeterMarca
}