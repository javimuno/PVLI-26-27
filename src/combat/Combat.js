import calcularDanioQTE from "./damage.js";
import generarVariante, { generarVarianteJugador } from "./variants.js";
export default class Combat {

    constructor(auraMaximaJugador=100,auraMaximaEnemigo=100,turnoInicial='jugador'){
        this.auraMaximaJugador =auraMaximaJugador;
        this.auraMaximaEnemigo =auraMaximaEnemigo;
        this.auraJugador = this.auraMaximaJugador;
        this.auraEnemigo = this.auraMaximaEnemigo;
        this.turno=turnoInicial;
        this.resultado = null;
        this.ultimaAccion = null; //para mostrarla
        this.marcaEnemigo = null;
        this.enemigoCongelado = false;
        this.venenoPendiente = false;
        this.danioVenenoTurno = 0;

        //variantes por familia, con la dificultad y el daño base
        this.ataquesJugador = [
            generarVarianteJugador('Mirada'),
            generarVarianteJugador('Pose'),
            generarVarianteJugador('Aura')
        ];       

         this.indiceAtaqueUsado =null; //para ver cual cambia

        this.ataquesEnemigo = [
            generarVariante('At.Enemigo 1'),
            generarVariante('At.Enemigo 2'),
            generarVariante('At.Enemigo 3')
        ];
    }

    //resuelve el ataque dle jugador, devuelve true si es valido 
    atacarEnemigo(danioBase,resultadoQTE='perfecto',elemento = null) {

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

        let danioMaximo = calcularDanioQTE(danioBase, 'perfecto');

        // Esta elección puede completar un combo de Fuego.
        if (elemento === 'fuego' && this.marcaEnemigo === 'fuego') {
            danioMaximo = Math.round(danioMaximo * 1.5);

        // El bonus sólo se consigue si la ejecución es Perfecta.
        if (resultadoQTE === 'perfecto') {
            danio = Math.round(danio * 1.5);
    }
}

        let auraAnterior = this.auraEnemigo;
        this.auraEnemigo = this.auraEnemigo - danio;

        if(this.auraEnemigo<0){
            this.auraEnemigo=0;
        }

        // resultado para mostrarlo en escena
        this.ultimaAccion = {
            actor: 'jugador',
            calidad: resultadoQTE,
            danioBase: danioBase,
            danioMaximo: danioMaximo,
            danioFinal: danio,
            danioAplicado: auraAnterior - this.auraEnemigo
        };

        if(this.auraEnemigo===0){
            this.resultado='victoria';
        }else{
            this.turno='enemigo';
        }

        return true;
        
    }

    //y este resuelve el ataque enemigo y cambia el turno si el jugador no ha perdido
    atacarJugador(danioBase, resultadoQTE = 'perfecto', ataque = null) {

        if(this.resultado!== null){
            return;
        }
        //console.log('Ataque enemigo con: ',danio,' puntos de danio');

        if(this.turno!=='enemigo'){
            return;
        }
        //salto de turno si está congelado
        if(this.resolverCongelacion()){            
            return;
        }

        let danio = calcularDanioQTE(danioBase,resultadoQTE);

        if (danio === null) {
        return;
}
        let auraAnterior = this.auraJugador;
        this.auraJugador = this.auraJugador - danio;

        if (this.auraJugador < 0) {
        this.auraJugador = 0;
        }

        // igual que en jugador guardamos accion
        this.ultimaAccion = {
            actor: 'enemigo',
            familia: 'Ataque enemigo',
            dificultad: null,
            calidad: resultadoQTE,
            danioBase: danioBase,
            danioMaximo: calcularDanioQTE(danioBase, 'perfecto'),
            danioFinal: danio,
            danioAplicado: auraAnterior - this.auraJugador
        };

        // completa info
        if (ataque !== null) {
            this.ultimaAccion.familia = ataque.familia;
            this.ultimaAccion.dificultad = ataque.dificultad;
        }

        if (this.auraJugador === 0) {
        this.resultado = 'derrota';
        }
        else {
            this.iniciarTurnoJugador();
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

        //combo de estado
        let combo= null;
        if (resultadoQTE === 'perfecto' && this.marcaEnemigo === ataque.elemento) {
        combo = ataque.elemento;
}

        let aceptado = this.atacarEnemigo(
        ataque.danioBase,
        resultadoQTE,
        ataque.elemento
        );

        if (!aceptado) {
            return false;
        }

        this.indiceAtaqueUsado = indice;

        // variante de la familia
        this.ultimaAccion.familia = ataque.familia;
        this.ultimaAccion.dificultad = ataque.dificultad;
        this.ultimaAccion.elemento = ataque.elemento;
        this.ultimaAccion.combo = combo;

        //aprovechar combo
        this.marcaEnemigo = null;

        //perfect de otro estado deja ese nuevo estado
        if(resultadoQTE==='perfecto'&&combo===null){
            this.marcaEnemigo = ataque.elemento;
        }

        //combo hielo
        if (combo === 'hielo' && this.resultado === null) {
        this.enemigoCongelado = true;
        }
        this.ultimaAccion.danioVeneno = 0;

        //combo veneno
        if (combo === 'veneno' && this.resultado === null) {
            this.ultimaAccion.danioVeneno = this.aplicarDanioVeneno();

        // si sigue vivo
        if (this.resultado === null) {
            this.venenoPendiente = true;
        }
}

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
        generarVarianteJugador(anterior.familia, anterior.elemento);

        this.indiceAtaqueUsado = null;
    }

    // devuelve el turno al jugador
    iniciarTurnoJugador() {
    if (this.resultado !== null) {
        return;
    }

    this.turno = 'jugador';
    this.renovarAtaqueJugador();
    this.danioVenenoTurno = 0;

    if (this.venenoPendiente) {
        // Consumimos el pendiente para que no vuelva a aplicarse.
        this.venenoPendiente = false;
        this.danioVenenoTurno = this.aplicarDanioVeneno();
    }
    }

    // true = congelado objetivo
    resolverCongelacion() {
        if (
            this.resultado !== null ||
            this.turno !== 'enemigo' ||
            this.enemigoCongelado === false
        ) {
            return false;
        }

        // consume el efecto de hielo
        this.enemigoCongelado = false;

        this.ultimaAccion = {
            actor: 'enemigo',
            tipo: 'congelado',
            danioFinal: 0,
            danioAplicado: 0
        };

        this.iniciarTurnoJugador();

        return true;
    }

    // aplica daño de veneno y devuelve cuanto ha hecho de daño
    aplicarDanioVeneno() {
        if (this.resultado !== null) {
            return 0;
        }

        let auraAnterior = this.auraEnemigo;
        this.auraEnemigo = this.auraEnemigo - 4;

        if (this.auraEnemigo < 0) {
            this.auraEnemigo = 0;
        }

        //por si el veneno es el que mata
        if (this.auraEnemigo === 0) {
            this.resultado = 'victoria';
        }

        return auraAnterior - this.auraEnemigo;
    }
}