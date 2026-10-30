export default function calcularDanioQTE (danioBase, resultadoQTE){

    
    if(resultadoQTE==='perfecto'){
        return danioBase;
    }

    if(resultadoQTE ==='bien'){
        return danioBase/2;
    }

    if(resultadoQTE==='fallo'){
        return 0;
    }

    console.error('Resultado de QTE no válido:', resultadoQTE);
    return null;
}