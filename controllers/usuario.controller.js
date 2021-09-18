'user strict'

var Usuario = require('../models/usuario.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');


// ----------- Administrador de inicio ------------------------ //
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



function Login(req, res){
    var params = req.body;

    if(params.usuario && params.password){
        Usuario.findOne({usuario: params.usuario}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseñas'});
                    }else if(checkPassword){
                        if(params.gettoken = 'true'){
                            res.send({
                                token: jwt.createToken(userFind),
                            })
                        }else{
                            return res.send({message: 'Usuario logeado'});
                            
                            
                        }
                    }else{
                        return res.status(403).send({message: 'Usuario o contraseña incorrectos'});
                    }
                })
            }else{
                return res.status(401).send({message: 'Cuenta de usuario no encontrada'});
            }
        })
    }else{
        return res.status(404).send({message: 'Por favor envía los campos obligatorios'});
    }
}


function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if(params.usuario && params.email && params.email && params.password && params.DPI && params.telefono){
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



module.exports ={
    initAdmin,
    saveUser,
    Login
}