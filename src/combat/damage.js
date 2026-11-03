export default function calcularDanioQTE (danioBase, resultadoQTE){

    
    if(resultadoQTE==='perfecto'){
        return Math.round(danioBase);
    }

    if(resultadoQTE ==='bien'){
        return Math.round(danioBase/2);
    }

    if(resultadoQTE==='fallo'){
        return 0;
    }

    console.error('Resultado de QTE no válido:', resultadoQTE);
    return null;
}