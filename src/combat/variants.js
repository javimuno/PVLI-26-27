let rangos = [{dificultad: 'facil',min:10,max:12},{dificultad: 'media',min:13,max:15},{
    dificultad:'dificil',min:16,max:20  
}];

function numAleatorio (min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

export default function generarVariante (familia){
    let indice = numAleatorio(0,rangos.length-1);
    let rango = rangos[indice];

    return{
        familia:familia,
        dificultad: rango.dificultad,
        danioBase: numAleatorio(rango.min,rango.max)
    };
}

// estados
export function generarVarianteJugador(familia, elementoAnterior = null) {
    let variante = generarVariante(familia);
    variante.dificultadBase = variante.dificultad;
    variante.sobrepensado = false;
    let elementos = ['fuego', 'hielo', 'veneno'];
    let opciones = [];

    // Excluimos el elemento de la variante que acaba de consumirse.
    for (let i = 0; i < elementos.length; i++) {
        if (elementos[i] !== elementoAnterior) {
            opciones.push(elementos[i]);
        }
    }

    let indice = numAleatorio(0, opciones.length - 1);
    variante.elemento = opciones[indice];

    return variante;
}