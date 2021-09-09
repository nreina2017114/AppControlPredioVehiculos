'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'encriptacion-Predio'

exports.createToken = (usuario) => {
    var payload = {
        sub: usuario._id,
        nombreU: usuario.nombreU,
        usuario: usuario.usuario,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().add(20, 'days').unix()
    }
    return jwt.encode(payload, secretKey)
}