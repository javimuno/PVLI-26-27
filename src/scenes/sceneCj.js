// contiene escena de Prueba de Cristopher

export default class SceneCj extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'sceneCj'});
    }
    //inicializacion de escenas
    init (){

    }
    //carga de imagenes, sonidos y recursos
    preload(){
        this.load.image('jugadorCubo', 'assets/gris.png');
    }
    //creacion de objetos en la escena
    
    create() {
        this.cameras.main.setBackgroundColor('#ac8ef0')
        let playerCube = this.add.image(300, 150, 'jugadorCubo');
        playerCube.setDisplaySize(30, 30);
    }

    //actualizacion repetida mientras la escena esta activa
    update() {
        
    }




}