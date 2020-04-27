// Importando socket io
const { io } = require('../server');

// Clases
const { Usuarios } = require('../classes/usuarios');

// Utilidades de mensajes de chat
const { crearMensaje } = require('../utilidades/utilidades');


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

    // Escuchando mensaje de usuario
    client.on('crearMensaje', (data) => {

        // Obteniendo persona por id
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        // Emitiendo a todo el mundo
        client.broadcast.emit('crearMensaje', mensaje);

    });

    // Desconexión
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        // Emitiendo mensaje de desconexión deusuario
        client.broadcast.emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));

        // Evento de conexión de persona (devuelve todas las personas)
        client.broadcast.emit('listaPersona', usuarios.getPersonas());
    });

});