import calcularDanioQTE from "./damage.js";

export default class Combat {

    constructor(auraMaximaJugador=100,auraMaximaEnemigo=100){
        this.auraMaximaJugador =auraMaximaJugador;
        this.auraMaximaEnemigo =auraMaximaEnemigo;
        this.auraJugador = this.auraMaximaJugador;
        this.auraEnemigo = this.auraMaximaEnemigo;
        this.turno='jugador';
        this.resultado = null;
    }

    atacarEnemigo(danioBase,resultadoQTE='perfecto') {

        if(this.resultado!== null){
            return;
        }
        //console.log('Ataque del jugador con: ',danio,' puntos de danio');

        if(this.turno!=='jugador'){
            return;
        }

        let danio = calcularDanioQTE(danioBase,resultadoQTE);
        

        this.auraEnemigo = this.auraEnemigo -danio;

        if(this.auraEnemigo<0){
            this.auraEnemigo=0;
        }

        if(this.auraEnemigo===0){
            this.resultado='victoria';
        }else{
            this.turno='enemigo';
        }

        
    }
    atacarJugador(danioBase, resultadoQTE='perfecto') {

        if(this.resultado!== null){
            return;
        }
        //console.log('Ataque enemigo con: ',danio,' puntos de danio');

        if(this.turno!=='enemigo'){
            return;
        }

        let danio = calcularDanioQTE(danioBase,'perfecto');
        this.auraJugador = this.auraJugador -danio;

        if(this.auraJugador<0){
            this.auraJugador=0;
        }

         if(this.auraJugador===0){
            this.resultado='derrota';
        }else{
            this.turno='jugador';
        }

        
    }
}