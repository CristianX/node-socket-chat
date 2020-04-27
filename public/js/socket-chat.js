 // IO Aparece gracias a la implementación del socket
 // var es para aumentar la compatibilidad entre diferentes navegadores web
 var socket = io();

 //  Obteniendo parametros de la url
 var params = new URLSearchParams(window.location.search);

 if (!params.has('nombre')) {

     window.location = 'index.html';

     throw new Error('El nombre es necesario');
 }

 var usuario = {
     nombre: params.get('nombre')
 };

 socket.on('connect', function() {
     console.log('Conectado al servidor');

     //  Enviando información de usuaruo al server
     socket.emit('entrarChat', usuario, function(resp) {
         console.log('Usuarios conectados', resp);
     });

 });

 // on es para escuchar información
 socket.on('disconnect', function() {
     console.log('Se perdió la conexión con el servidor');
 });

 // Enviar información, se puede enviar booleans, string, etc pero no es recomendable, lo mejor es mandar un objeto
 socket.emit('enviarMensaje', {
     usuario: 'Cristian',
     mensaje: 'Hola mundo'
 }, function(resp) {
     // console.log('Se disparó el callback');
     console.log('Respuesta server: ', resp);
 });


 // Escuchando información del server
 socket.on('crearMensaje', function(mensaje) {
     console.log('Servidor', mensaje);
 });

 //  Escuchar cambios de usuarios
 // cuando un usuario entra o sale del chat
 socket.on('listaPersona', function(personas) {
     console.log(personas);
 });