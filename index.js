// IMPORTACION
const mongoose =  require("mongoose");
const app = require("./app");
var usuario = require('./controllers/usuario.controller');
var port = 3000;

mongoose.Promise = global.Promise;
//mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/DBPredio_Vehiculos', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    usuario.initAdmin();
    console.log('Se encuentra conectado a la base de datos');

    app.listen(port, function () {
        console.log("Servidor corriendo en el puerto " + port);
    })
}).catch((err) => console.log('Error de conexión a la base de datos', err))
