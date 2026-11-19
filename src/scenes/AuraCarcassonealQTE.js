export default class AuraCarcassonealQTE extends Phaser.Scene {

    constructor() {
        super({ key: 'auraCarcassonealQTE' });
    }

    init(datos = {}) {
        this.dificultad = datos.dificultad || 'facil';
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

        let volver = this.add.text(328, 260, 'VOLVER AL COMBATE', {
            fontSize: '18px',
            color: '#80ed99'
        }).setOrigin(0.5);

        volver.setInteractive({ useHandCursor: true });

        volver.on('pointerdown', () => {
            this.scene.resume('combat');
            this.scene.stop();
        });
    }
}