import calcularDanioQTE from "./damage.js";
import generarVariante from "./variants.js";

export default class Combat {

    constructor(auraMaximaJugador=100,auraMaximaEnemigo=100,turnoInicial='jugador'){
        this.auraMaximaJugador =auraMaximaJugador;
        this.auraMaximaEnemigo =auraMaximaEnemigo;
        this.auraJugador = this.auraMaximaJugador;
        this.auraEnemigo = this.auraMaximaEnemigo;
        this.turno=turnoInicial;
        this.resultado = null;

        //variantes por familia, con la dificultad y el daño base
        this.ataquesJugador = [generarVariante('Mirada'),generarVariante('Pose'),generarVariante('Aura')];
        this.indiceAtaqueUsado =null; //para ver cual cambia
        this.ataquesEnemigo = [generarVariante('At.Enemigo 1'),generarVariante('At.Enemigo 2'),generarVariante('At.Enemigo 3')];
    }

    //resuelve el ataque dle jugador, devuelve true si es valido 
    atacarEnemigo(danioBase,resultadoQTE='perfecto') {

        if(this.resultado!== null){
            return false;
        }
        //console.log('Ataque del jugador con: ',danio,' puntos de danio');

        if(this.turno!=='jugador'){
            return false;
        }

        let danio = calcularDanioQTE(danioBase,resultadoQTE);
        
        if (danio === null) {
        return false;
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

        return true;
        
    }

    //y este resuelve el ataque enemigo y cambia el turno si el jugador no ha perdido
    atacarJugador(danioBase, resultadoQTE='perfecto') {

        if(this.resultado!== null){
            return;
        }
        //console.log('Ataque enemigo con: ',danio,' puntos de danio');

        if(this.turno!=='enemigo'){
            return;
        }

        let danio = calcularDanioQTE(danioBase,resultadoQTE);
        this.auraJugador = this.auraJugador -danio;

        if (this.auraJugador < 0) {
        this.auraJugador = 0;
    }

        if (this.auraJugador === 0) {
        this.resultado = 'derrota';
        }
        else {
            this.turno = 'jugador';
            this.renovarAtaqueJugador();
        }

        
    }

    //usa la vriante elegida y recuerda cual ha sido para renovarla despues    
    usarAtaqueJugador(indice, resultadoQTE = 'perfecto') {
        if (
            !Number.isInteger(indice) ||
            indice < 0 ||
            indice >= this.ataquesJugador.length
        ) {
            return false;
        }

        let ataque = this.ataquesJugador[indice];

        let aceptado = this.atacarEnemigo(
            ataque.danioBase,
            resultadoQTE
        );

        if (!aceptado) {
            return false;
        }

        this.indiceAtaqueUsado = indice;

        return true;
    }

    //sustituye la variante que el jugador ha usado en su ataque anterior
    renovarAtaqueJugador() {
        if (this.indiceAtaqueUsado === null) {
            return;
        }

        let anterior =
            this.ataquesJugador[this.indiceAtaqueUsado];

        this.ataquesJugador[this.indiceAtaqueUsado] =
            generarVariante(anterior.familia);

        this.indiceAtaqueUsado = null;
    }
}