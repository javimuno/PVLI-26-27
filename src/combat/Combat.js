export default class Combat {

    constructor(){
        this.auraMaximaJugador =100;
        this.auraMaximaEnemigo =100;
        this.auraJugador = this.auraMaximaJugador;
        this.auraEnemigo = this.auraMaximaEnemigo;
        this.turno='jugador';
        this.resultado = null;
    }

    atacarEnemigo(danio) {

        if(this.resultado!== null){
            return;
        }
        console.log('Ataque del jugador con: ',danio,' puntos de danio');

        if(this.turno!=='jugador'){
            return;
        }
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
    atacarJugador(danio) {

        if(this.resultado!== null){
            return;
        }
        console.log('Ataque enemigo con: ',danio,' puntos de danio');

        if(this.turno!=='enemigo'){
            return;
        }
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