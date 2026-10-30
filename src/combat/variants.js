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