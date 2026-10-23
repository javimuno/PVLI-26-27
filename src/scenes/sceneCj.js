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
    }
    //creacion de objetos en la escena
    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBackgroundColor('#ac8ef0')
        this.playerCube = this.physics.add.image(300, 150, 'playerCube');
        this.playerCube.setVelocity(0, 0);
        this.playerCube.setDisplaySize(30, 30);
    }

    //actualizacion repetida mientras la escena esta activa
    update() {
        if(this.cursors.down.isDown){
            this.playerCube.setVelocity(0, 100);
        }else if(this.cursors.up.isDown){
            this.playerCube.setVelocity(0, -100);
        }else if(this.cursors.left.isDown){
            this.playerCube.setVelocity(-100, 0);
        }else if(this.cursors.right.isDown){
            this.playerCube.setVelocity(100, 0);
        }else{
            this.playerCube.setVelocity(0, 0);
        }
    }




}