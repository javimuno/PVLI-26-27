import QTECards from '../quicktimeevents/discordantCards.js';

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

        const texto = this.cache.text.get('discordOpt');
        const lineas = texto.trim().split(/\r?\n/);
        this.guay = lineas[0].trim().split(/\s+/);
        this.noguay = lineas[1].trim().split(/\s+/);

        let correcto = Phaser.Math.Between(0, 2);
        this.acierto = 0;
        this.fin = false;
        this.green = Phaser.Display.Color.ValueToColor(0x95ff00);
        this.red = Phaser.Display.Color.ValueToColor(0xff0000);

        this.fondo2 = this.add.image(328, 188, 'playerCube');
        this.insideBar = this.add.rectangle(325, 60, 600, 32, 0x95ff00);
        this.add.image(328, 59, 'barTime');
        
        this.option = [];

        this.option[0] = new QTECards(this, 164, 188, 'dCards');
        this.option[0].on('pointerdown', pointer =>{
            if(!this.fin){
                if(correcto == 0) this.acierto = 1;
                else this.acierto = 2;
            }
        })

        this.option[1] = new QTECards(this, 328, 188, 'dCards');
        this.option[1].on('pointerdown', pointer =>{
            if(!this.fin){
                if(correcto == 1) this.acierto = 1;
                else this.acierto = 2;
            }
        })

        this.option[2] = new QTECards(this, 492, 188, 'dCards');
        this.option[2].on('pointerdown', pointer =>{
            if(!this.fin){
                if(correcto == 2) this.acierto = 1;
                else this.acierto = 2;
            }
        })

        for(let i = 0; i < 3; i++) {
            if(i != correcto) this.option[i].changeText(Phaser.Utils.Array.GetRandom(this.guay));
            else this.option[i].changeText(Phaser.Utils.Array.GetRandom(this.noguay));
        }

        this.timeOnScreen = 6;

        this.textoTiempo = this.add.text(20, 20, 'Tiempo: 6', {
            fontSize: '30px', color: '#000000'
        })

        this.textoCorrecto = this.add.text(328, 300, '¿Cuál no pertenece?', {
            fontSize: '30px', color: '#000000'
        }).setOrigin(0.5, 0)
    }   

    update(t, dt){
        if(!this.fin){
            if(this.acierto == 1){
            this.textoCorrecto.setText('Acertaste');
            this.fin = true;
            }else if(this.timeOnScreen > 0.1 && this.acierto != 2){
            this.timeOnScreen -= dt / 1000;
            this.insideBar.width -= dt / 10;
            this.color = Phaser.Display.Color.Interpolate.ColorWithColor(this.red, this.green, 1, this.insideBar.width / 600);
            this.insideBar.setFillStyle(Phaser.Display.Color.GetColor(this.color.r, this.color.g, this.color.b));
            this.textoTiempo.setText('Tiempo: ' + Math.floor(this.timeOnScreen));
            }else {
            this.textoCorrecto.setText('Fallaste');
            this.fin = true;
            }
        }else {
            this.timeleft = this.time.delayedCall(1000, () => {
            this.scene.start('minimap');
            })
        } 
    }
}
