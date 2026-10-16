// contiene la clase que deeeee momento representa la priemra escena

export default class Scene1 extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'scene1'});
    }
    //inicializacion de escenas
    init (){

    }
    //carga de imagenes, sonidos y recursos
    preload(){
        this.load.image('fondo','assets/plaza-mewing.png');

        //this.load.image('test','assets/7-turnos.png', {frameWidth: 48, frameHeight: 48})
    }
    //creacion de objetos en la escena
    
    create() {
        this.fondo = this.add.image(328, 188, 'fondo');
        this.fondo.setDisplaySize(656, 376);
        //this.add.sprite(2, 2, 'test')
    }

    //actualizacion repetida mientras la escena esta activa
    update(){

    }




}