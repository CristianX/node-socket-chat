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


        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        // Conectando usuario a una sala
        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // Evento de conexión de persona (devuelve todas las personas)
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        // Emitiendo mensaje de conexión de usuario a la sala
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    // Escuchando mensaje de usuario
    client.on('crearMensaje', (data, callback) => {

        // Obteniendo persona por id
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        // Emitiendo a todo el mundo en esa sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);

    });

    // Desconexión
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        // Emitiendo mensaje de desconexión de usuario a la sala
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));

        // Evento de conexión de persona (devuelve todas las personas de la sala)
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // Mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        // to es para quien va dirigido ese mensaje
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});