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
    }
    //creacion de objetos en la escena
    
    create() {
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);
    }

    //actualizacion repetida mientras la escena esta activa
    update(){
    }




}