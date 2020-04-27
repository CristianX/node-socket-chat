 // IO Aparece gracias a la implementación del socket
 // var es para aumentar la compatibilidad entre diferentes navegadores web
 var socket = io();

 //  Obteniendo parametros de la url
 var params = new URLSearchParams(window.location.search);

 if (!params.has('nombre') || !params.has('sala')) {

     window.location = 'index.html';

     throw new Error('El nombre y la sala son necesarios');
 }

 var usuario = {
     nombre: params.get('nombre'),
     sala: params.get('sala')
 };

 socket.on('connect', function() {
     console.log('Conectado al servidor');

     //  Enviando información de usuaruo al server
     socket.emit('entrarChat', usuario, function(resp) {
         //  console.log('Usuarios conectados', resp);

         // Renderizando usuarios de socket-chat-jquery.js
         renderizarUsuarios(resp);
     });

 });

 // on es para escuchar información
 socket.on('disconnect', function() {
     console.log('Se perdió la conexión con el servidor');
 });

 // Enviar información, se puede enviar booleans, string, etc pero no es recomendable, lo mejor es mandar un objeto
 //  socket.emit('crearMensaje', {
 //      usuario: 'Cristian',
 //      mensaje: 'Hola mundo'
 //  }, function(resp) {
 //      // console.log('Se disparó el callback');
 //      console.log('Respuesta server: ', resp);
 //  });


 // Escuchando información del server
 //  Recibiendo mensajes de otro usuario de la sal
 socket.on('crearMensaje', function(mensaje) {
     //  console.log('Servidor', mensaje);
     renderizarMensajes(mensaje);
 });

 //  Escuchar cambios de usuarios
 // cuando un usuario entra o sale del chat
 socket.on('listaPersona', function(personas) {
     //  console.log(personas);
     renderizarUsuarios(personas);
 });


 //  Mensajes privados
 socket.on('mensajePrivado', function(mensaje) {
     console.log('Mensaje privado', mensaje);
 });