import Combat from '../combat/Combat.js'
import sorteoCalidad from '../combat/quality.js';



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
    
    // prr defecto, el resultado del jugador se sigue sorteando
    this.calidadPrueba = 'aleatorio';
    this.defensaPrueba = 'aleatorio';
}

create(){

    this.cameras.main.setBackgroundColor('#182033')

    this.crearPanelesCombate();

    this.textoCalidadPrueba = this.add.text(
    24, 46,
    'QTE simulado: ' + this.calidadPrueba + ' (clic)',
    { fontSize: '13px', color: '#ffd166' }
    );

    this.textoCalidadPrueba.setInteractive({ useHandCursor: true });

    //calidad de la prueba (tambien incluyendo la proteccion)
    this.textoCalidadPrueba.on(
    'pointerdown',
    this.cambiarCalidadPrueba,
    this
    );

    //selector de defensa
    this.textoDefensaPrueba = this.add.text(
        390, 46,
        'Defensa simulada: ' + this.defensaPrueba + ' (clic)',
        { fontSize: '12px', color: '#ffd166' }
    );

    this.textoDefensaPrueba.setInteractive({ useHandCursor: true });

    this.textoDefensaPrueba.on(
        'pointerdown',
        this.cambiarDefensaPrueba,
        this
    );

     //textos de simulacion
    this.textoJugador = this.add.text(10,80,'Aura del jugador: '+this.combate.auraJugador);
    this.textoEnemigo = this.add.text(410,80,'Aura del enemigo: '+this.combate.auraEnemigo);
    this.textoTurno = this.add.text (24,330,'Turno de: '+this.combate.turno);

    //texto marca
    this.textoMarca = this.add.text(24, 115, '', {
    fontSize: '13px',
    color: '#f4a261'
    });

    //texto veneno
    this.textoVeneno = this.add.text(24, 185, '', {
    fontSize: '12px',
    color: '#a7df62'    
    });

    //texto intencion enemiga
    this.textoIntencion = this.add.text(24, 305, '', {
    fontSize: '12px',
    color: '#ffd166'
    });
    
    //proteccion
    this.textoProteccion = this.add.text(240, 280, '', {
    fontSize: '12px',
    color: '#aaaaaa'
    });

    //boton de protección

    this.textoProteccion.setInteractive({ useHandCursor: true });
    this.textoProteccion.on(
        'pointerdown',
        this.accionProteccion,
        this
    );


    //botones

    //-ataque jugador-
    this.textoAccionJugador = this.add.text(24, 140, '', { fontSize: '12px' });
    this.textoAccionEnemigo = this.add.text(24, 165, '', { fontSize: '12px' });

    this.botonesAtaque = [];
    this.textosDificultad = [];
    this.textosElemento = [];

    //aquí se crean los botones y cada boton tiene un indice para luego seleccionar
    //la variante dentro de la familia de ataque que sea
    for (let i = 0; i < this.combate.ataquesJugador.length; i++) {

        let ataque = this.combate.ataquesJugador[i];

        let boton = this.add.text(
        24 + i * 208,
        200,
        ataque.familia + '\n\n' +
        'Daño base: ' + ataque.danioBase
        );

        boton.setInteractive({ useHandCursor: true });

        boton.on('pointerdown', () => {
            this.accionJugador(i);
        });

        this.botonesAtaque.push(boton);

        this.textosDificultad.push(
        this.add.text(28 + i * 152, 270, '', {
            fontSize: '12px'
        })
         );

        this.textosElemento.push(
        this.add.text(28 + i * 152, 302, '', {
            fontSize: '12px'
        })
         );
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
    this.barraEnemigo.setOrigin(0, 0);

    //arial
    for (let objeto of this.children.list) {
    if (objeto.type === 'Text') {
        objeto.setFontFamily('Arial');
        //objeto.setFontStyle('bold');
    }
}

    this.ordenarInterfazCombate();
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
    let calidad = this.calidadPrueba;

    // solo hay aleatoriedad si no hemos elegido un modo concreto (testeo mas facil)
    if (calidad === 'aleatorio') {
        calidad = sorteoCalidad(ataque);
    }

    let aceptado = this.combate.usarAtaqueJugador(
        indice,
        calidad
    );

    if (!aceptado) {
        return;
    }

    let accion = this.combate.ultimaAccion;
    let textoCombo = '';

    if (accion.combo === 'fuego') { 
        textoCombo = ' | Fuego: +50%';
    }
    else if (accion.combo === 'hielo') { 
    textoCombo = ' | Hielo: congela';
    }
    else if (accion.combo === 'veneno' && accion.danioVeneno > 0) {
    textoCombo = ' | Veneno: -' + accion.danioVeneno + ' ahora';
    }

    this.textoAccionJugador.setText(
        'Jugador: ' + accion.familia + ' / ' +
        accion.dificultad + ' / ' + accion.calidad +
        ' (daño: ' + accion.danioFinal + '/' + accion.danioMaximo + ')' +
        textoCombo
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
    let aceptado = this.combate.ejecutarIntencionEnemiga();

    if (!aceptado) {
        return;
    }

    let accion = this.combate.ultimaAccion;

    if (accion.tipo === 'congelado') {
        this.textoAccionEnemigo.setText(
            'Enemigo: pierde su acción por Hielo'
        );
    }
    else if (accion.tipo === 'sobrepensar') {
        if (accion.objetivo === null) {
            this.textoAccionEnemigo.setText(
                'Enemigo: Sobrepensar sin efecto'
            );
        }
        else {
            let objetivo = accion.objetivo;

            this.textoAccionEnemigo.setText(
                'Sobrepensar: ' + objetivo.familia + ' / ' +
                objetivo.dificultadAnterior + ' -> ' +
                objetivo.dificultadNueva
            );
    }
}
    else {
        let textoBloqueo = '';

        if (accion.danioBloqueado > 0) {
            textoBloqueo = ' | Bloqueado: ' + accion.danioBloqueado;
        }

        this.textoAccionEnemigo.setText(
            'Enemigo: ' + accion.familia + ' / ' +
            accion.dificultad + ' / ' + accion.calidad +
            ' (daño: ' + accion.danioFinal + '/' + accion.danioMaximo + ')' +
            textoBloqueo
        );
    }

    this.actualizarPantalla();
}

//refleja toda la información del combate en pantalla, es el feedback visual de momento
//de info de combate y de botones
actualizarPantalla() {


    //proteccion
    if (this.combate.proteccionActiva) {
    this.textoProteccion.setText('Protección: bloqueo activo');
    this.textoProteccion.setColor('#75d5ff');
    }
    else if (this.combate.puedeUsarProteccion()) {
        this.textoProteccion.setText('Usar protección');
        this.textoProteccion.setColor('#80ed99');
    }
    else if (this.combate.proteccionCargada) {
        this.textoProteccion.setText('Protección cargada (no disponible)');
        this.textoProteccion.setColor('#aaaaaa');
    }
    else {
        this.textoProteccion.setText(
            'Protección: ' + this.combate.rachaPerfectos + '/2 Perfectos'
        );

        this.textoProteccion.setColor('#aaaaaa');
    }

    //intencion enemiga
    if (this.combate.resultado !== null) {
    this.textoIntencion.setText('Intención: combate terminado');
    }
    else if (this.combate.intencionEnemigo.tipo === 'sobrepensar') {
        this.textoIntencion.setText(
            'Intención: Sobrepensar (subirá una dificultad; sin daño)'
        );
    }
    else {
        let intencion = this.combate.intencionEnemigo;

        this.textoIntencion.setText(
            'Intención: ' + intencion.ataque.familia + ' / ' +
            intencion.ataque.dificultad + ' / hasta ' +
            intencion.danioMaximo + ' de daño'
        );
    }

    // colores para los estados
    let coloresEstado = {
        fuego: '#ffad60',
        hielo: '#b3e5fc',
        veneno: '#c29afa'
    };

    this.textoMarca.setColor(
        coloresEstado[this.combate.marcaEnemigo] || '#aaaaaa'
    );

    this.textoVeneno.setColor(coloresEstado.veneno);

    //marca de estado
    if (this.combate.marcaEnemigo === null) {
    this.textoMarca.setText('Marca enemiga: ninguna');
    }
    else {
        this.textoMarca.setText(
            'Marca enemiga: ' + this.combate.marcaEnemigo +
            ' (hasta tu siguiente acción)'
        );
    }

    //gestion del veneno
    if (this.combate.venenoPendiente && this.combate.resultado === null) {
    this.textoVeneno.setText(
        'Veneno: 4 Aura al próximo turno'
    );
    }
    else if (this.combate.danioVenenoTurno > 0) {
        this.textoVeneno.setText(
            'Veneno: -' + this.combate.danioVenenoTurno +
            ' Aura al comenzar este turno'
        );
    }
    else {
        this.textoVeneno.setText('Veneno: inactivo');
    }


    
    // Colores para reconocer la dificultad y el elemento de cada carta.
    let coloresDificultad = {
        facil: '#80ed99',
        media: '#ffd166',
        dificil: '#ff7777'
    };

    let coloresElemento = {
        fuego: '#ffad60',
        hielo: '#b3e5fc',
        veneno: '#c29afa'
    };

    //bucle generador de cartas
    for (let i = 0; i < this.botonesAtaque.length; i++) {
        let ataque = this.combate.ataquesJugador[i];

        this.botonesAtaque[i].setText(
            ataque.familia + '\n\n' +
            'Daño base: ' + ataque.danioBase
        );
        this.botonesAtaque[i].setColor('#ffffff');

        let dificultad = ataque.dificultad;
        let color = coloresDificultad[ataque.dificultad];

        // El rosa distingue la dificultad aumentada por Sobrepensar.
        if (ataque.sobrepensado) {
            dificultad = ataque.dificultadBase + ' -> ' + ataque.dificultad;
            color = '#ff8fbc';
        }

        this.textosDificultad[i].setText(dificultad);
        this.textosDificultad[i].setColor(color);

        this.textosElemento[i].setText('Elemento: ' + ataque.elemento);
        this.textosElemento[i].setColor(coloresElemento[ataque.elemento]);
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

    this.textoCalidadPrueba.setVisible(
    this.combate.resultado === null
    );

    this.textoDefensaPrueba.setVisible(
        this.combate.resultado === null
    );
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

// Cambia el resultado de prueba sin consumir el turno.
cambiarCalidadPrueba() {
    if (this.calidadPrueba === 'aleatorio') {
        this.calidadPrueba = 'perfecto';
    }
    else if (this.calidadPrueba === 'perfecto') {
        this.calidadPrueba = 'bien';
    }
    else if (this.calidadPrueba === 'bien') {
        this.calidadPrueba = 'fallo';
    }
    else {
        this.calidadPrueba = 'aleatorio';
    }

    this.textoCalidadPrueba.setText(
        'QTE simulado: ' + this.calidadPrueba + ' (clic)'
    );
}

accionProteccion() {
    if (this.combate.puedeUsarProteccion() === false) {
        return;
    }

    let acierto = false;

    if (this.defensaPrueba === 'aleatorio') {
        acierto = Math.random() < 0.5;
    }
    else if (this.defensaPrueba === 'acierto') {
        acierto = true;
    }

    let aceptado = this.combate.usarProteccion(acierto);

    if (!aceptado) {
        return;
    }

    if (acierto) {
        this.textoAccionJugador.setText(
            'Defensa simulada: acierto. Bloqueo preparado.'
        );
    }
    else {
        this.textoAccionJugador.setText(
            'Defensa simulada: fallo. Carga consumida.'
        );
    }

    this.textoAccionEnemigo.setText('');
    this.actualizarPantalla();

    this.time.delayedCall(800, this.accionEnemigo, [], this);
}

cambiarDefensaPrueba() {
    if (this.defensaPrueba === 'aleatorio') {
        this.defensaPrueba = 'acierto';
    }
    else if (this.defensaPrueba === 'acierto') {
        this.defensaPrueba = 'fallo';
    }
    else {
        this.defensaPrueba = 'aleatorio';
    }

    this.textoDefensaPrueba.setText(
        'Defensa simulada: ' + this.defensaPrueba + ' (clic)'
    );
    }

crearPanelesCombate() {
    // Arena y suelo.
    this.add.rectangle(16, 52, 624, 126, 0x202d45)
        .setOrigin(0, 0).setStrokeStyle(1, 0x526078).setDepth(-20);

    this.add.rectangle(17, 145, 622, 32, 0x30424b)
        .setOrigin(0, 0).setDepth(-19);

    // Panel de intención.
    this.add.rectangle(220, 60, 216, 78, 0x131d2d)
        .setOrigin(0, 0).setStrokeStyle(1, 0x8b744d).setDepth(-18);

    this.add.text(328, 10, 'PLAZA DEL MEWING', {
        fontSize: '12px',
        color: '#e0ad58'
    }).setOrigin(0.5, 0);

    // Fondos de las tres cartas ofensivas.
    this.fondosAtaque = [];

    for (let i = 0; i < this.combate.ataquesJugador.length; i++) {
        let fondo = this.add.rectangle(
            16 + i * 152, 244, 144, 88, 0x172334
        ).setOrigin(0, 0)
         .setStrokeStyle(1, 0x526078)
         .setDepth(-10);

        fondo.setInteractive({ useHandCursor: true });

        fondo.on('pointerdown', () => {
            this.accionJugador(i);
        });

        this.fondosAtaque.push(fondo);
    }

    // Panel separado para la defensa.
    this.fondoProteccion = this.add.rectangle(
        480, 244, 160, 88, 0x142b2b
    ).setOrigin(0, 0)
     .setStrokeStyle(1, 0x77ad9f)
     .setDepth(-10);

    this.add.text(492, 252, 'IMPROVISACIÓN\nPROTECTORA', {
        fontSize: '10px',
        color: '#b6d9d0'
    });

    this.add.text(492, 316, 'Consume el turno', {
        fontSize: '9px',
        color: '#aeb9c9'
    });
    }

    ordenarInterfazCombate() {
    this.textoJugador.setPosition(16, 12)
        .setStyle({ fontSize: '12px' });

    this.textoEnemigo.setPosition(440, 12)
        .setStyle({ fontSize: '12px' });

    this.fondoBarraJugador.setPosition(16, 34);
    this.barraJugador.setPosition(16, 34);
    this.fondoBarraEnemigo.setPosition(440, 34);
    this.barraEnemigo.setPosition(440, 34);

    this.textoTurno.setPosition(328, 28)
        .setOrigin(0.5, 0)
        .setStyle({ fontSize: '11px', color: '#e0ad58' });

    this.textoIntencion.setPosition(230, 67)
        .setStyle({
            fontSize: '11px',
            wordWrap: { width: 196 },
            align: 'center'
        });

    this.textoAccionJugador.setPosition(16, 184)
        .setStyle({ fontSize: '11px' });

    this.textoAccionEnemigo.setPosition(16, 202)
        .setStyle({ fontSize: '11px' });

    this.textoMarca.setPosition(16, 224)
        .setStyle({ fontSize: '11px' });

    this.textoVeneno.setPosition(380, 224)
        .setStyle({ fontSize: '11px' });

    for (let i = 0; i < this.botonesAtaque.length; i++) {
        this.botonesAtaque[i].setPosition(28 + i * 152, 254)
            .setStyle({
                fontSize: '12px',
                wordWrap: { width: 120 }
            });
    }

    this.textoProteccion.setPosition(492, 280)
        .setStyle({
            fontSize: '11px',
            wordWrap: { width: 136 }
        });

    this.textoCalidadPrueba.setPosition(16, 354)
        .setStyle({ fontSize: '12px' });

    this.textoDefensaPrueba.setPosition(320, 354)
        .setStyle({ fontSize: '12px' });

    this.botonReinicio.setPosition(584, 354)
        .setStyle({ fontSize: '12px' })
        .setText('Reiniciar');

    this.botonMenu.setPosition(16, 352)
        .setStyle({ fontSize: '11px' })
        .setText('Volver al menú');
}
}