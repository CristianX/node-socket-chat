// Importando socket io
const { io } = require('../server');

// Clases
const { Usuarios } = require('../classes/usuarios');


const usuarios = new Usuarios();

// Para saber cuando un usario se conecta al server
// client tiene toda la información de la computadora o de la conexión que se establecio
io.on('connection', (client) => {



    client.on('entrarChat', (data, callback) => {

        if (!data.nombre) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }

        let personas = usuarios.agregarPersona(client.id, data.nombre);

        callback(personas);
    });

});