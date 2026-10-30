/**| Dificultad | Daño base | Fallo | Bien | Perfecto |
|---            |---:       |---:   |---:  |---:      |
| Fácil         | 10–12     | 10 %  | 30 % | 60 %     |
| Media         | 13–15     | 20 %  | 35 % | 45 %     |
| Difícil       | 16–20     | 30 %  | 35 % | 35 %     | */

import Combat from '../src/combat/Combat.js';
import generarVariante from '../src/combat/variants.js';

let probabilidades = {
    facil: { fallo: 10, bien: 30, perfecto: 60 },
    media: { fallo: 20, bien: 35, perfecto: 45 },
    dificil: { fallo: 30, bien: 35, perfecto: 35 }
};

function sortearCalidad(ataque) {
    let perfil = probabilidades[ataque.dificultad];
    let numero = Math.random() * 100;

    if (numero < perfil.fallo) {
        return 'fallo';
    }

    if (numero < perfil.fallo + perfil.bien) {
        return 'bien';
    }

    return 'perfecto';
}

function crearOpciones(nombres) {
    return [
        generarVariante(nombres[0]),
        generarVariante(nombres[1]),
        generarVariante(nombres[2])
    ];
}

function simularCombate() {
    let inicio = 'jugador';

    if (Math.random() >= 0.5) {
        inicio = 'enemigo';
    }

    let combate = new Combat(100, 100, inicio);

    let ataquesJugador = crearOpciones([
        'Mirada', 'Pose', 'Aura'
    ]);

    let ataquesEnemigo = crearOpciones([
        'Enemigo 1', 'Enemigo 2', 'Enemigo 3'
    ]);

    let pendienteRenovar = null;
    let acciones = 0;

    while (combate.resultado === null && acciones < 500) {
        let actor = combate.turno;

        if (actor === 'jugador' && pendienteRenovar !== null) {
            let anterior = ataquesJugador[pendienteRenovar];

            ataquesJugador[pendienteRenovar] =
                generarVariante(anterior.familia);

            pendienteRenovar = null;
        }

        let opciones = ataquesJugador;

        if (actor === 'enemigo') {
            opciones = ataquesEnemigo;
        }

        let indice = Math.floor(
            Math.random() * opciones.length
        );

        let ataque = opciones[indice];
        let calidad = sortearCalidad(ataque);

        if (actor === 'jugador') {
            combate.atacarEnemigo(ataque.danioBase, calidad);
            pendienteRenovar = indice;
        }
        else {
            combate.atacarJugador(ataque.danioBase, calidad);
        }

        acciones = acciones + 1;
    }

    return {
        inicio: inicio,
        resultado: combate.resultado,
        acciones: acciones
    };
}

function crearResumen(inicio) {
    return {
        inicia: inicio,
        partidas: 0,
        victoriasJugador: 0,
        victoriasEnemigo: 0,
        sinTerminar: 0,
        totalAcciones: 0
    };
}

function ejecutarPruebas(cantidad) {
    let dificultades = ['facil', 'media', 'dificil'];

    for (let i = 0; i < dificultades.length; i = i + 1) {
        let perfil = probabilidades[dificultades[i]];
        let suma = perfil.fallo + perfil.bien + perfil.perfecto;

        if (
            perfil.fallo < 0 ||
            perfil.bien < 0 ||
            perfil.perfecto < 0 ||
            suma !== 100
        ) {
            console.error('Probabilidades incorrectas:', perfil);
            return;
        }
    }

    let resumen = {
        jugador: crearResumen('jugador'),
        enemigo: crearResumen('enemigo')
    };

    for (let i = 0; i < cantidad; i = i + 1) {
        let partida = simularCombate();
        let grupo = resumen[partida.inicio];

        grupo.partidas = grupo.partidas + 1;

        if (partida.resultado === 'victoria') {
            grupo.victoriasJugador = grupo.victoriasJugador + 1;
        }
        else if (partida.resultado === 'derrota') {
            grupo.victoriasEnemigo = grupo.victoriasEnemigo + 1;
        }
        else {
            grupo.sinTerminar = grupo.sinTerminar + 1;
        }

        if (partida.resultado !== null) {
            grupo.totalAcciones =
                grupo.totalAcciones + partida.acciones;
        }
    }

    let filas = [resumen.jugador, resumen.enemigo];

    for (let i = 0; i < filas.length; i = i + 1) {
        let fila = filas[i];

        let finalizados =
            fila.victoriasJugador + fila.victoriasEnemigo;

        fila.victoriasJugadorPct = null;
        fila.accionesMedias = null;

        if (finalizados > 0) {
            fila.victoriasJugadorPct = Math.round(
                10000 * fila.victoriasJugador / finalizados
            ) / 100;

            fila.accionesMedias = Math.round(
                100 * fila.totalAcciones / finalizados
            ) / 100;
        }
    }

    console.table(filas);
}

ejecutarPruebas(1000);