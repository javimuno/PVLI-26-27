export default class DiscordantQte extends Phaser.Scene{
    constructor() {
        super({key:'discord'})
    }

    init() {
    }

    create() {

        this.timeleft = this.time.delayedCall(8000, () => {
            console.log("Fallo");
            this.scene.start('mainMenu');
        })

        let correcto = Phaser.Math.Between(1, 3);
        this.acierto = 0;

        this.fondo2 = this.add.image(328, 188, 'playerCube');
        
        this.option1 = this.add.sprite(164, 188, 'darkBlue').setInteractive().setOrigin(0.5,0.5);
        this.option1.setDisplaySize(125, 150);
        this.option1.on('pointerdown', pointer =>{
            if(correcto == 1) this.acierto = 1;
            else this.acierto = 2;
        })

        this.option2 = this.add.sprite(328, 188, 'yellow').setInteractive().setOrigin(0.5,0.5);
        this.option2.setDisplaySize(125, 150);
        this.option2.on('pointerdown', pointer =>{
            if(correcto == 2) this.acierto = 1;
            else this.acierto = 2;
        })

        this.option3 = this.add.sprite(492, 188, 'lightBlue').setInteractive().setOrigin(0.5,0.5);
        this.option3.setDisplaySize(125, 150);
        this.option3.on('pointerdown', pointer =>{
            if(correcto == 3) this.acierto = 1;
            else this.acierto = 2;
        })
        this.timeOnScreen = 6;

        this.textoTiempo = this.add.text(20, 20, 'Tiempo: 6', {
            fontSize: '30px', color: '#000000'
        })

        this.textoCorrecto = this.add.text(328, 300, '¿Cuál no pertenece?', {
            fontSize: '30px', color: '#000000'
        }).setOrigin(0.5, 0)
    }   

    update(t, dt){
        if(this.acierto == 1){
            this.textoCorrecto.setText('Acertaste');
            this.timeleft = this.time.delayedCall(1000, () => {
            this.scene.start('mainMenu');
        })
        }else if(this.timeOnScreen > 0.1 && this.acierto != 2){
        this.timeOnScreen -= dt / 1000;
        this.textoTiempo.setText('Tiempo: ' + Math.floor(this.timeOnScreen));
        }else {
            this.textoCorrecto.setText('Fallaste');
            this.timeleft = this.time.delayedCall(1000, () => {
            this.scene.start('mainMenu');
        })
        }
    }
}
