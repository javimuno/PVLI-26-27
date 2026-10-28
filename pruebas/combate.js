import Combat from '../src/combat/Combat.js';

let combate = new Combat();

let textoJugador = document.getElementById('aura-jugador');
let textoEnemigo = document.getElementById('aura-enemigo');
let textoTurno = document.getElementById('turno');
let textoResultado = document.getElementById('resultado');

let botonJugador = document.getElementById('boton-jugador');
let botonEnemigo = document.getElementById('boton-enemigo');
let botonReiniciar = document.getElementById('boton-reiniciar');

function actualizarPantalla(){


    textoJugador.textContent = 'Aura del jugador: '+ combate.auraJugador;
    textoEnemigo.textContent = 'Aura del enemigo: '+ combate.auraEnemigo

    if(combate.resultado===null){
        textoTurno.textContent = 'Turno: '+combate.turno;
        textoResultado.textContent = 'Combate en curso';
    } else{
        textoTurno.textContent = 'Combate finalizado';
        textoResultado.textoEnemigo = 'Resultado: '+combate.resultado;
    }
}

function accionJugador(){
    combate.atacarEnemigo(10);
    actualizarPantalla();
}

function accionEnemigo(){
    combate.atacarJugador(10);
    actualizarPantalla();
}

function reiniciarCombate(){
    combate = new Combat();
    actualizarPantalla();
}


botonJugador.addEventListener('click',accionJugador);
botonEnemigo.addEventListener('click',accionEnemigo);
botonReiniciar.addEventListener('click',reiniciarCombate);

actualizarPantalla();