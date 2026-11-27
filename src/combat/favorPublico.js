export default function actualizarFavorPublico(favorActual, actor, calidad) {

    let cambio = 0;

    // si ataca el jugador
    if (actor === 'jugador') {
        if (calidad === 'perfecto') {
            cambio = 1;
        }
        else if (calidad === 'fallo') {
            cambio = -1;
        }
    }

    // si ataca el enemigo
    else if (actor === 'enemigo') {
        if (calidad === 'perfecto') {
            cambio = -1;
        }
        else if (calidad === 'fallo') {
            cambio = 1;
        }
    }

    favorActual = favorActual + cambio;

    // limitamos el favor a los extremos
    if (favorActual > 2) {
        favorActual = 2;
    }
    else if (favorActual < -2) {
        favorActual = -2;
    }

    return favorActual;
}