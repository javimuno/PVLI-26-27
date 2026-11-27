import QTECards from '../quicktimeevents/discordantCards.js';

export default class DiscordantQte extends Phaser.Scene{
    constructor() {
        super({key:'discord'})
    }

    init(datos) {
        this.finalizar = datos.finalizar;
    }

    create() {
        this.superado = false;
        // Contador inicial
        this.timeleft = this.time.delayedCall(8000, () => {
            console.log("Fallo");
            this.scene.start('combat');
            this.finalizar(this.superado);
        })

        //Lectura de opcionesDiscord.txt
        const texto = this.cache.text.get('discordOpt');
        const lineas = texto.trim().split(/\r?\n/);
        let familia = Phaser.Math.Between(0, 3);
        this.guay = lineas[familia].trim().split(/\s+/);
        this.noguay = lineas[familia + 4].trim().split(/\s+/);
        //Variables
        this.cardsNum = 4;
        let correcto = Phaser.Math.Between(0, this.cardsNum - 1); //Aleatorio que elige el QTECard correcto
        this.acierto = 0; //¿Ha acertado? Por defecto 0
        this.fin = false; //Estado del QTE
        this.green = Phaser.Display.Color.ValueToColor(0x95ff00);
        this.red = Phaser.Display.Color.ValueToColor(0xff0000);
        this.option = []; //Array en el que se crearán los QTECards
        this.cardsPos = 656 / (this.cardsNum + 1);
        this.nextCard = this.cardsPos;

        //Creación de fondo y barra de tiempo
        this.fondo2 = this.add.image(328, 188, 'playerCube');
        this.insideBar = this.add.rectangle(325, 60, 600, 32, '#95ff00');
        this.add.image(328, 59, 'barTime');

        //Instance de QTECards y su interactuabilidad
        for(let i = 0; i < this.cardsNum; i++){
            this.option[i] = new QTECards(this, this.nextCard, 200, 'dCards'); //QTECard 1
            this.option[i].on('pointerdown', pointer =>{
                if(!this.fin){
                    if(correcto == i) this.acierto = 1;
                    else this.acierto = 2;
                }
            })
            this.nextCard += this.cardsPos;
        }
               
        //Asignación de opciones
        for(let i = 0; i < this.cardsNum; i++) {  
            if(i != correcto) this.option[i].changeText(Phaser.Utils.Array.GetRandom(this.guay));
            else this.option[i].changeText(Phaser.Utils.Array.GetRandom(this.noguay));
        }

        this.timeOnScreen = 6; //Tiempo en pantalla
        
        //Texto informativo
        this.textoCorrecto = this.add.text(328, 300, '¿Cuál no pertenece?', {
            fontSize: '30px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5, 0)
    }   

    update(t, dt){
        if(!this.fin){ //Mientras no se ha ejecutado la escena
            if(this.acierto == 1){
            this.textoCorrecto.setText('Acertaste');
            this.fin = true;
            this.superado = true;
            }else if(this.timeOnScreen > 0.1 && this.acierto != 2){
            this.timeOnScreen -= dt / 1000;
            this.insideBar.width -= dt / 10;
            this.color = Phaser.Display.Color.Interpolate.ColorWithColor(this.red, this.green, 1, this.insideBar.width / 600);
            this.insideBar.setFillStyle(Phaser.Display.Color.GetColor(this.color.r, this.color.g, this.color.b));
            }else {
            this.textoCorrecto.setText('Fallaste');
            this.fin = true;
            }
        }else { //Finaliza la escena
            this.timeleft = this.time.delayedCall(1000, () => {
            this.scene.stop();
            this.finalizar(this.superado);
            })
        } 
    }
}
