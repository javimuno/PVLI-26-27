export default class AuraCarcassonealQTE extends Phaser.Scene {

    constructor() {
        super({ key: 'auraCarcassonealQTE' });
    }

    init(datos = {}) {
        this.dificultad = datos.dificultad || 'facil';
        this.finalizar = datos.finalizar;
        this.terminado = false;

        //Respuestas introducidas por el jugador
        this.respuestas = {};
        //Hueco seleccionado actualmente
        this.huecoSeleccionado = null;
    }

    create() {
        this.cameras.main.setBackgroundColor('#182033');

        this.add.text(328, 22, 'AURA CARCASSONEAL', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(328, 55, 'Dificultad: ' + this.dificultad, {
            fontSize: '20px',
            color: '#ffd166'
        }).setOrigin(0.5);

        let calidades = ['perfecto', 'bien', 'fallo'];

        calidades.forEach((calidad, indice) => {

            let boton = this.add.text(
                120 + indice * 200,
                346,
                calidad.toUpperCase(),
                {
                    fontSize: '18px',
                    color: '#80ed99'
                }
            ).setOrigin(0.5);

            boton.setInteractive({ useHandCursor: true });

            boton.on('pointerdown', () => {
                this.terminarQTE(calidad);
            });
        });

        // Vértices de los hexágonos paraambos paneles
        this.puntosHexagono = [
            33,  0,
            66, 19,
            66, 57,
            33, 76,
            0, 57,
            0, 19
        ];

        //Preparacion del puzzle
        this.prepararPuzzle();
        this.crearTablero();
        this.crearPiezasOfrecidas();

        console.log('Dificultad:', this.dificultad);
        console.log('Piezas retiradas:', this.huecos);

        //Checker del mezclado de piezas
        console.log('Huecos:', this.huecos);
        console.table(this.piezasOfrecidas);
        console.log('Soluciones:', this.soluciones);

        // Detectamos las pulsaciones del teclado durante el QTE
        this.input.keyboard.on('keydown', this.procesarTecla, this);

        // Eliminamos el evento cuando se cierra la escena
        this.events.once('shutdown', () => {
            this.input.keyboard.off('keydown', this.procesarTecla, this);
});
    }

    
    terminarQTE(calidad) {

        if (this.terminado) {
            return;
        }
        //evita resultado duplicado
        this.terminado = true;

        this.scene.stop();
        this.finalizar(calidad);
    }

    
    prepararPuzzle() {

        let cantidades = {
            facil: 3,
            media: 4,
            dificil: 6
        };

        let cantidad = cantidades[this.dificultad];

        // Las 12 piezas del mosaico original
        let disponibles = [1, 2, 3, 4, 5, 6,
                        7, 8, 9, 10, 11, 12];

        this.huecos = [];

        for (let i = 0; i < cantidad; i++) {

            let indice = Phaser.Math.Between(0, disponibles.length - 1);

            let pieza = disponibles[indice];

            disponibles.splice(indice, 1);

            this.huecos.push(pieza);
        }

        // Copiamos las piezas retiradas para mezclarlas sin alterar los huecos
        let pendientes = this.huecos.slice();

        let letras = ['A', 'B', 'C', 'D', 'E', 'F'];

        this.piezasOfrecidas = [];
        this.soluciones = {};

        for (let i = 0; i < this.huecos.length; i++) {

            // Elegimos una pieza al azar entre las que quedan
            let indice = Phaser.Math.Between(0, pendientes.length - 1);
            let pieza = pendientes[indice];

            pendientes.splice(indice, 1);

            // Le asignamos una letra según su posición entre las ofrecidas
            let letra = letras[i];

            this.piezasOfrecidas.push({
                pieza: pieza,
                letra: letra
            });

            // El número del hueco depende de su posición en this.huecos
            let numero = this.huecos.indexOf(pieza) + 1;

            this.soluciones[numero] = letra;
        }
    }

    crearTablero() {

        

        // Tres filas con cuatro piezas cada una
        for (let fila = 0; fila < 3; fila++) {
            for (let columna = 0; columna < 4; columna++) {

                let pieza = fila * 4 + columna + 1;

                let x = 65 + columna * 66 + (fila % 2) * 33;
                let y = 122 + fila * 57;

                let esHueco = this.huecos.includes(pieza);

                let color = esHueco ? 0x182033 : 0x38516b;

                this.add.polygon(x, y, this.puntosHexagono, color)
                .setOrigin(0.5)
                .setStrokeStyle(2, 0xffd166);

                let texto;

                if (esHueco) {
                    texto = String(this.huecos.indexOf(pieza) + 1);
                }
                else {
                    texto = 'P' + pieza;
                }

                this.add.text(x, y, texto, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5).setDepth(1);
            }
        }
    }

    crearPiezasOfrecidas() {

        for (let i = 0; i < this.piezasOfrecidas.length; i++) {

            let pieza = this.piezasOfrecidas[i];

            // Dos columnas y hasta tres filas
            let columna = i % 2;
            let fila = Math.floor(i / 2);

            let x = 452 + columna * 115;
            let y = 119 + fila * 77;

            this.add.polygon(x, y, this.puntosHexagono, 0x38516b)
                .setOrigin(0.5)
                .setStrokeStyle(2, 0xffd166);

            // Letra que recibe la pieza en este QTE
            this.add.text(x, y - 12, pieza.letra, {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5).setDepth(1);

            // Identificador provisional para comprobarlo
            this.add.text(x, y + 14, 'P' + pieza.pieza, {
                fontSize: '12px',
                color: '#ffd166'
            }).setOrigin(0.5).setDepth(1);
        }
    }

    procesarTecla(evento) {

        if (this.terminado || evento.repeat) {
            return;
        }

        let tecla = evento.key.toUpperCase();

        let numero = Number(tecla);

        // Seleccionamos un hueco válido
        if (Number.isInteger(numero) &&
            numero >= 1 &&
            numero <= this.huecos.length) {

            this.huecoSeleccionado = numero;

            console.log('Hueco seleccionado:', numero);
            return;
        }

        // No podemos colocar una pieza sin seleccionar un hueco
        if (this.huecoSeleccionado === null) {
            return;
        }

        // Comprobamos si la letra pertenece a una pieza ofrecida
        for (let i = 0; i < this.piezasOfrecidas.length; i++) {

            if (tecla === this.piezasOfrecidas[i].letra) {

                this.colocarPieza(this.huecoSeleccionado, tecla);
                this.huecoSeleccionado = null;
                return;
            }
        }
    }

    colocarPieza(numero, letra) {

        // Si la pieza ya estaba colocada, liberamos su hueco anterior
        for (let i = 1; i <= this.huecos.length; i++) {

            if (this.respuestas[i] === letra) {
                delete this.respuestas[i];
            }
        }

        this.respuestas[numero] = letra;

        console.log('Respuestas:', this.respuestas);
    }
}