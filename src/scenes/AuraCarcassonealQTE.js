export default class AuraCarcassonealQTE extends Phaser.Scene {

    constructor() {
        super({ key: 'auraCarcassonealQTE' });
    }

    init(datos = {}) {
        this.dificultad = datos.dificultad || 'facil';
        this.finalizar = datos.finalizar;
        this.terminado = false;
    }

    create() {
        this.cameras.main.setBackgroundColor('#182033');

        this.add.text(328, 100, 'AURA CARCASSONEAL', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(328, 170, 'Dificultad: ' + this.dificultad, {
            fontSize: '20px',
            color: '#ffd166'
        }).setOrigin(0.5);

        let calidades = ['perfecto', 'bien', 'fallo'];

        calidades.forEach((calidad, indice) => {

            let boton = this.add.text(
                120 + indice * 200,
                260,
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
}