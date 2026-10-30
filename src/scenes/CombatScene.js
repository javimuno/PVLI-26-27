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


    //barras aura - para colores en hexa https://htmlcolorcodes.com/es/
    //-jugador-
    this.fondoBarraJugador = this.add.rectangle(10,100,200,8,0x444444); //gris
    this.fondoBarraJugador.setOrigin(0,0);
    this.barraJugador = this.add.rectangle(10,100,200,8,0x55cc88); //verde
    this.barraJugador.setOrigin(0,0);
    //-enemigo-
    this.fondoBarraEnemigo = this.add.rectangle(450,100,200,8,0x8A210C);
    this.fondoBarraEnemigo.setOrigin(0,0);
    this.barraEnemigo = this.add.rectangle(450,100,200,8,0x55cc88); //rojo oscuro
    this.barraEnemigo.setOrigin(0,0);

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

    this.barraJugador.scaleX = this.combate.auraJugador/this.combate.auraMaximaJugador;
    this.barraEnemigo.scaleX = this.combate.auraEnemigo/this.combate.auraMaximaEnemigo;
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