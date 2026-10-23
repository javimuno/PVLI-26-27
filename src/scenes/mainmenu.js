export default class MainMenu extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'mainMenu'});
    }
    //inicializacion de escenas
    init (){

    }
    //carga de imagenes, sonidos y recursos
    preload(){
        this.load.image('fondo','assets/plaza-mewing.png');
        this.load.image('startButton','assets/startButton.png');
        this.load.image('playerCube','assets/gris.png');
        

    }
    //creacion de objetos en la escena
    
    create() {
        this.fondo = this.add.image(328, 188, 'fondo');
        this.fondo.setDisplaySize(656, 376);
        
        this.button = this.add.sprite(328, 188, 'startButton').setInteractive();
        this.button.setDisplaySize(300, 300);

        this.button.on('pointerdown', pointer =>{
            this.scene.start('sceneCj');
        })

    }

    //actualizacion repetida mientras la escena esta activa
    update(){

        
    }




}