'user strict'

var Usuario = require('../models/usuario.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
const { getRole } = require("../models/roles.model");


var fs = require('fs');
var path = require('path');



// ----------------------------------------------------------------------------------------------------------------
function initAdmin(req, res){
    let user = new Usuario();
    user.usuario = 'ADMIN'
    user.password = '123456'

    Usuario.findOne({usuario: user.usuario}, (err, adminFind)=>{
        if(err){
            return res.status(500).send({mensaje: 'Error general'});
        }else if(adminFind){
            return console.log('Usuario admin ya existente')
        }else{
            bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({mensaje: 'Error al intentar comparar las contraseñas'})
                }else if(passwordHash){
                    user.password = passwordHash;
                    user.usuario = user.usuario;
                    user.rol = 'ROL_ADMIN';
                    user.save((err, userSaved)=>{
                        if(err){
                            return res.status(500).send({mensaje: 'Error al guardar Administrador'})
                        }else if(userSaved){
                            return console.log('Administrador creado satisfactoriamente')
                        }else{
                            return res.status(500).send({mensaje: 'Administrador no guardado'})
                        }
                    })
                }else{
                    return res.status(403).send({mensaje: 'La encriptación de la contraseña falló'})
                }
            })
        }
    })
}



// ----------------------------------------------------------------------------------------------------------------
function Login(req, res){
    var params = req.body;

    if(params.usuario && params.password){
        Usuario.findOne({usuario: params.usuario}, (err, userFind)=>{
            if(err){
                return res.status(500).send({mensaje: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({mensaje: 'Error general al comparar contraseñas'});
                    }else if(checkPassword){
                        if(params.gettoken = 'true'){
                            res.send({
                                token: jwt.createToken(userFind),
                            })
                        }else{
                            return res.send({mensaje: 'Usuario logeado'});
                            
                            
                        }
                    }else{
                        return res.status(403).send({mensaje: 'Usuario o contraseña incorrectos'});
                    }
                })
            }else{
                return res.status(401).send({mensaje: 'Cuenta de usuario no encontrada'});
            }
        })
    }else{
        return res.status(404).send({mensaje: 'Por favor envía los campos obligatorios'});
    }
}



// ----------------------------------------------------------------------------------------------------------------
function saveUser(req, res){
    var user = new Usuario();
    var params = req.body;
    const userRole = getRole(role);


    if(params.usuario && params.email && params.password && params.DPI && params.telefono){
        Usuario.findOne({usuario: params.usuario}, (err, userFind)=>{
            if(err){
                return res.status(500).send({mensaje: 'Error general'});
            }else if(userFind){
                return res.send({mensaje: 'Nombre de usuario no disponible.'});
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        return res.status(500).send({mensaje: 'Error general al comparar contraseña'});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.nombreU = params.nombreU;
                        user.usuario = params.usuario.toLowerCase();
                        user.email = params.email.toLowerCase();
                        user.telefono = params.telefono;
                        user.DPI = params.DPI;
                        user.role = userRole,


                        user.save((err, userSaved)=>{
                            if(err){
                                return res.status(500).send({mensaje: 'Error general al guardar usuario'});
                            }else if(userSaved){
                                return res.send({mensaje: 'Usuario creado exitosamente', userSaved});
                            }else{
                                return res.status(500).send({mensaje: 'No se guardó el usuario'});
                            }
                        })
                    }else{
                        return res.status(403).send({mensaje: 'La contraseña no se ha encriptado'});
                    }
                })
            }
        })
    }else{
        return res.status(401).send({mensaje: 'Por favor envía los datos mínimos para la creación de tu cuenta'})
    }
}



// ----------------------------------------------------------------------------------------------------------------
function getUsers(req, res){
    User.find().exec((err, users) => {
        if(err){
            return res.status(500).send({mensaje: "Error al buscar los usuarios"})
        }else if(users){
            console.log(users)
            return res.send({mensaje: "Usuarios encontrados", users})
        }else{
            return res.status(204).send({mensaje: "No se encontraron usuarios"})
        }
    });
}



// ----------------------------------------------------------------------------------------------------------------
function getUserID(req, res) {
    var UserId = req.params.userId;
 
    /*
    User.findById(UserId, (err, userEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!userEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({mensaje:"El Usuario ha sido encontrado exitosamente" ,userEncontrado });
    })
    */
    User.findById(UserId, (err, userEncontrado) => {
    if(err){
        return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
    }else if(userEncontrado){
        console.log(users)
        return res.status(200).send({mensaje:"El Usuario ha sido encontrado exitosamente" ,userEncontrado });
    }else{
        return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
       }
   });
 }
    


// ----------------------------------------------------------------------------------------------------------------
function updateUser(req, res){
    var idUser = req.params.id;
    var update = req.body; 

    if(idUser != req.user.sub){
        res.status(403).send({mensaje:"No tienes permisos para esta ruta"});
    }else{
        Usuario.findOne({usuario:update.usuario},(err,userRepeat)=>{
            if(err){
                res.status(500).send({mensaje:"Error general en el servidor ",err});
            }else if(userRepeat){
                res.status(403).send({mensaje:"No puede actualizar su nombre de usuario porque ya esta en uso"});
            }else{
                User.findByIdAndUpdate(idUser, update, {new:true},(err,updateUser) =>{
                    if(err){
                        res.status(500).send({mensaje:"Error en el servidor ", err});
                    }else if(updateUser){
                        res.send({Usuario_Actualizado: updateUser});
                    }else{
                        res.status(404).send({mensaje:"El usuario que quiere actualizar no existe"});
                    }
                });
            }
        });
    }
}



// ---------------------------------------------------------------------------------------------------------------
function DeleteUser(req, res){
    let idUser= req.params.id

    if(req.user.rol ==="ROL_ADMIN" && req.user.sub === idUser){
         return res.status(400).send({mensaje:"Eliminar al admin es IMPOSIBLE, por favor no vuelva de intentarlo"})
    }
    if(req.user.sub != idUser && req.user.rol != "ROL_ADMIN" ){
         return res.status(500).send({mensaje:"No puedes eliminar a otro Usuario"})
}
    
        Usuario.findByIdAndDelete(idUser, (err, UsuarioEliminado)=>{
    if(err){
        return res.status(500).send({mensaje: "Error al eliminar al usuario"})
    }else if(UsuarioEliminado){
        return res.status(200).send({mensaje:"El Usuario se ha elimando correctamente",UsuarioEliminado})
    }else{
        return res.status(500).send({mensajes:"Error al eliminar o El usuario ya ha sido eliminado"})
        }
   })
}



// ----------------------------------------------------------------------------------------------------------------
function search(req, res){
    var params = req.body;

    if(params.search){
        Usuario.find({$or:[{nombreU: params.search},
                        {usuario: params.search},
                    {email: params.email},
                {DPI: params.DPI}]}, (err, resultsSearch)=>{
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



module.exports ={
    initAdmin,
    saveUser,
    Login,
    getUsers,
    getUserID,
    updateUser,
    search,
    DeleteUser
}