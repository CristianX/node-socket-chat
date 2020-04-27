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

        // Evento de conexión de persona (devuelve todas las personas)
        client.broadcast.emit('listaPersona', usuarios.getPersonas());

        callback(personas);
    });


    // Desconexión
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        // Emitiendo mensaje de desconexión deusuario
        client.broadcast.emit('crearMensaje', { usuario: 'Adminsitrador', mensaje: `${ personaBorrada.nombre } abandonó el chat` });

        // Evento de conexión de persona (devuelve todas las personas)
        client.broadcast.emit('listaPersona', usuarios.getPersonas());
    });

});