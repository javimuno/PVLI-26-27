import Combat from '../combat/Combat.js'
import sorteoCalidad from '../combat/quality.js';
import calcularDanioQTE from '../combat/damage.js';


//Muestra el estado del combate y transforma los inputs  en las acciones
//que rigen toda la logica, tanto del jugador como del enemigo aunque ele 
//enemigo funcione de manera automatica y sus acciones sean la respuesta
//a lo que hace el jugador
export default class CombatScene extends Phaser.Scene{

    constructor(){
        super({key:'combat'}) //inicializa escena con constructor padre
    }

init(datos={}){
    this.combate = new Combat(datos.auraMaximaJugador,datos.auraMaximaEnemigo);
}

create(){

    this.cameras.main.setBackgroundColor('#182033')

    this.add.text(300,24,'Combate');
     //textos de simulacion
    this.textoJugador = this.add.text(10,80,'Aura del jugador: '+this.combate.auraJugador);
    this.textoEnemigo = this.add.text(410,80,'Aura del enemigo: '+this.combate.auraEnemigo);
    this.textoTurno = this.add.text (24,330,'Turno de: '+this.combate.turno);
    
    //botones

    //-ataque jugador-
    this.textoAccionJugador = this.add.text(24, 125, '');
    this.textoAccionEnemigo = this.add.text(24, 150, '');

    this.botonesAtaque = [];

    //aquí se crean los botones y cada boton tiene un indice para luego seleccionar
    //la variante dentro de la familia de ataque que sea
    for (let i = 0; i < this.combate.ataquesJugador.length; i++) {
    let ataque = this.combate.ataquesJugador[i];

    let boton = this.add.text(
        24 + i * 208,
        200,
        ataque.familia + '\n' +
        ataque.dificultad + '\n' +
        'Daño base: ' + ataque.danioBase
    );

    boton.setInteractive({ useHandCursor: true });

    boton.on('pointerdown', () => {
        this.accionJugador(i);
    });

    this.botonesAtaque.push(boton);
    }

    //-reinicio-
    this.botonReinicio=this.add.text(24,280,'Reinciar Partida');
    this.botonReinicio.setInteractive({useHandCursor:true});
    this.botonReinicio.on('pointerdown',this.reiniciarCombate,this);

    //volver al menu ppal
    this.botonMenu = this.add.text(400,350,'Volver al menu principal');
    this.botonMenu.setInteractive({useHandCursor: true});
    this.botonMenu.on('pointerdown',this.volverAlMenu,this);


    //barras aura - para colores en hexa https://htmlcolorcodes.com/es/
    //-jugador-
    this.fondoBarraJugador = this.add.rectangle(10,100,200,8,0x444444); //gris
    this.fondoBarraJugador.setOrigin(0,0);
    this.barraJugador = this.add.rectangle(10,100,200,8,0x55cc88); //verde
    this.barraJugador.setOrigin(0,0);
    //-enemigo-
    this.fondoBarraEnemigo = this.add.rectangle(410,100,200,8,0x8A210C);
    this.fondoBarraEnemigo.setOrigin(0,0);
    this.barraEnemigo = this.add.rectangle(410,100,200,8,0x55cc88); //rojo oscuro
    this.barraEnemigo.setOrigin(0,0);

    this.actualizarPantalla();

}


accionJugador(indice) {
    if (this.combate.resultado !== null) {
        return;
    }

    if (this.combate.turno !== 'jugador') {
        return;
    }

    let ataque = this.combate.ataquesJugador[indice];

    //de momento simula el QTE del jugador hasta que los tengamos que así podía probarlo
    let calidad = sorteoCalidad(ataque);

    let aceptado = this.combate.usarAtaqueJugador(
        indice,
        calidad
    );

    if (!aceptado) {
        return;
    }

    let danio = calcularDanioQTE(ataque.danioBase, calidad);

    this.textoAccionJugador.setText(
    'Jugador: ' + ataque.familia + ' / ' +
    ataque.dificultad + ' / ' + calidad +
    ' (daño: ' + danio + '/' + ataque.danioBase + ')'
    );

    this.textoAccionEnemigo.setText('');

    this.actualizarPantalla();

    //aquí solo hay respuesta si la pelea continua y el turno es del enemigo
    if (
        this.combate.resultado === null &&
        this.combate.turno === 'enemigo'
    ) {
        this.time.delayedCall(
            800, this.accionEnemigo, [], this
        );
    }
}

accionEnemigo() {
    if (
        this.combate.resultado !== null ||
        this.combate.turno !== 'enemigo'
    ) {
        return;
    }

    let indice = Math.floor(
        Math.random() * this.combate.ataquesEnemigo.length
    );

    let ataque = this.combate.ataquesEnemigo[indice];
    //igual que antes solo que aquí si que se quedará creo más o menos así implementado
    //porque hace un sorteo del ataque enemigo segun la dificultad y el ataque elegido
    let calidad = sorteoCalidad(ataque);

    this.combate.atacarJugador(
        ataque.danioBase,
        calidad
    );

    let danio = calcularDanioQTE(ataque.danioBase, calidad);

    this.textoAccionEnemigo.setText(
    'Enemigo: ' + ataque.familia + ' / ' +
    ataque.dificultad + ' / ' + calidad +
    ' (daño: ' + danio + '/' + ataque.danioBase + ')'
    );

    this.actualizarPantalla();
}

//refleja toda la información del combate en pantalla, es el feedback visual de momento
//de info de combate y de botones
actualizarPantalla() {

    for (let i = 0; i < this.botonesAtaque.length; i++) {
    let ataque = this.combate.ataquesJugador[i];

    this.botonesAtaque[i].setText(
        ataque.familia + '\n' +
        ataque.dificultad + '\n' +
        'Daño base: ' + ataque.danioBase
    );
}

    this.barraJugador.scaleX = this.combate.auraJugador/this.combate.auraMaximaJugador;
    this.barraEnemigo.scaleX = this.combate.auraEnemigo/this.combate.auraMaximaEnemigo;
    this.textoJugador.setText(
        'Aura del jugador: ' + this.combate.auraJugador+'/'+this.combate.auraMaximaJugador
    );

    this.textoEnemigo.setText(
        'Aura del enemigo: ' + this.combate.auraEnemigo+'/'+this.combate.auraMaximaEnemigo
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

    //<- Menu ppal
    this.botonMenu.setVisible(
        this.combate.resultado!==null
    )
}

reiniciarCombate(){
    this.scene.restart({auraMaximaJugador:125,
        auraMaximaEnemigo:125
    });
}

volverAlMenu(){
    if(this.combate.resultado===null){
        return;
    }

    this.scene.start('mainMenu')
}
}