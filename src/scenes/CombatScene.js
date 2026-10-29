import Combat from '../combat/Combat.js'

export default class CombatScene extends Phaser.Scene{

    constructor(){
        super({key:'combat'}) //constructor de Combat.js que es de quien hereda
    }

init(){
    this.combate = new Combat();
}

create(){

    this.cameras.main.setBackgroundColor('#182033')

    this.add.text(300,24,'Combate');
     //textos de simulacion
    this.textoJugador = this.add.text(10,80,'Aura del jugador: '+this.combate.auraJugador);
    this.textoEnemigo = this.add.text(450,80,'Aura del enemigo: '+this.combate.auraEnemigo);
    this.textoTurno = this.add.text (10,330,'Turno de: '+this.combate.turno);
    
    //botones

    //-ataque jugador-
    this.botonAtaque=this.add.text(24,230,'atacar(10)');
    this.botonAtaque.setInteractive({useHandCursor: true});
    this.botonAtaque.on('pointerdown',this.accionJugador,this);

    //-reinicio-
    this.botonReinicio=this.add.text(24,280,'Reinciar Partida');
    this.botonReinicio.setInteractive({useHandCursor:true});
    this.botonReinicio.on('pointerdown',this.reiniciarCombate,this);

}


accionJugador() {

    if(this.combate.resultado!==null){
        return;
    }

    if(this.combate.turno !=='jugador'){
        return;
    }


    this.combate.atacarEnemigo(30);
    this.actualizarPantalla();

    if(this.combate.resultado===null){
        this.time.delayedCall(800,this.accionEnemigo,[],this);
    }
}

accionEnemigo(){
    this.combate.atacarJugador(15);
    this.actualizarPantalla();
}

actualizarPantalla() {
    this.textoJugador.setText(
        'Aura del jugador: ' + this.combate.auraJugador
    );

    this.textoEnemigo.setText(
        'Aura del enemigo: ' + this.combate.auraEnemigo
    );

    
    if(this.combate.resultado==='victoria'){
        this.textoTurno.setText('VICTORIA');    
    }
    else if (this.combate.resultado ==='derrota'){
        this.textoTurno.setText('DERROTA')
    }
    else{
        this.textoTurno.setText('Turno: ' + this.combate.turno);

    }
}

reiniciarCombate(){
    this.scene.restart();
}
}