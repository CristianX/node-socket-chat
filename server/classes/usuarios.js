class Usuarios {

    constructor() {

        // Personas conectadas al chat
        this.personas = [];
    }


    // Agregando persona al chat
    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        };

        this.personas.push(persona);


        // Retornando todas las personas que estan en el chat
        return this.personas;
    }

    // Obteniendo persona por id
    getPersona(id) {

        // Filter regrresa un arreglo donde se cumpla la condición del id; se pone [0] por que solo se desea que regrese un registro
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;

    }

    // Obteniendo a todas las personas
    getPersonas() {
        return this.personas;
    }

    // Retornando personas por sala
    getPersonasPorSala(sala) {
        // ....
    }

    // Eliminar personas del arreglo de personas (sale del chat, se desconecta)
    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => persona.id !== id);

        return personaBorrada;
    }


}

module.exports = {
    Usuarios
};