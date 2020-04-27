// Se encargará de todas las funciones para renderizar, modificar, etc. Del html

//  Obteniendo parametros de la url
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de JQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas) {

    console.log(personas);


    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + ' </span></a>';
    html += '</li>';


    for (var i = 0; i < personas.length; i++) {

        html += '<li>'; // Por lo general atributos personalizados comienzan con data como data-id
        html += '   <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';


    }

    divUsuarios.html(html);




}

// Listeners (Para escuchar el id) 'a' es por el ancortag del usuario, es dinamico para que capte cuando entra y sale
divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');

    if (id) {
        console.log(id);

    }


});


// Listener de mensaje
formEnviar.on('submit', function(evento) {

    evento.preventDefault();

    // trim quita los espacios adelante y al final
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    // Enviar información, se puede enviar booleans, string, etc pero no es recomendable, lo mejor es mandar un objeto
    socket.emit('crearMensaje', {
        usuario: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        // console.log('Se disparó el callback');
        // console.log('Respuesta server: ', resp);

        // focus para que el cursor se quede ahi aunque se toque el boton
        txtMensaje.val('').focus();

        // true para decir que hyo envio el mensaje
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });


});

// Renderizar mensajes para que aparezcan en el html

function renderizarMensajes(mensaje, yo) {

    var html = '';

    // Construyendo hora
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ' : ' + fecha.getMinutes();

    // Reconocer si administrador envia el mensaje
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }


    // Identificar si soy yo

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';

        // Quitando la imagen si es administrador
        if (mensaje.nombre !== "Administrador") {

            html += '   <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.nombre + '</h5>';
        html += '       <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '   </div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }




    divChatbox.append(html);

}

// Calcula si hay que mantener el scroll abajo o donde está en ese momento
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}