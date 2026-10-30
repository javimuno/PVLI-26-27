export default class BarQTE extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'barQTE'});

        this.speed = 200;
        this.danio = 100; 
    }
    //inicializacion de escenas
    init (){

    }
    //carga de imagenes, sonidos y recursos
    preload(){
        

    }
    //creacion de objetos en la escena
    
    create() {
        this.espacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.fondo2 = this.add.image(328, 188, 'playerCube');
        this.fondo2.setDisplaySize(656, 376);
        
        this.bad = this.physics.add.image(328, 150, 'darkBlue');
        this.bad.body.setAllowGravity(false);
        this.bad.setDisplaySize(600, 30);
        
        this.mid = this.physics.add.image(300, 150, 'lightBlue');
        this.mid.body.setAllowGravity(false);
        this.mid.setDisplaySize(100, 30);

        this.good = this.physics.add.image(300, 150, 'yellow');
        this.good.body.setAllowGravity(false);
        this.good.setDisplaySize(50, 30);

        this.bar = this.physics.add.image(300, 150, 'bar');
        this.bar.body.setAllowGravity(false);
        this.bar.setDisplaySize(5, 40);
        this.bar.setVelocity(-this.speed, 0);

    }

    //actualizacion repetida mientras la escena esta activa
    update(){
        if (Phaser.Input.Keyboard.JustDown(this.espacio)) {
        //Para la barra
        this.bar.setVelocity(0, 0);
        // Comprobar colisiones con good
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.bar.getBounds(), this.good.getBounds())) {
            this.danio = this.danio * 1;
        }

        // Comprobar colisiones con mid
        else if (Phaser.Geom.Intersects.RectangleToRectangle(this.bar.getBounds(), this.mid.getBounds())) {
            this.danio = this.danio * 0.5;
        }

        //Comprobar colisiones con bad
        else if (Phaser.Geom.Intersects.RectangleToRectangle(this.bar.getBounds(), this.bad.getBounds())) {
            this.danio = this.danio * 0;
        }
    }


    if (this.bar.x >= 600) {
        this.bar.setVelocity(-this.speed, 0);
    }

    if (this.bar.x <= 56) {
        this.bar.setVelocity(this.speed, 0);
    }

    }




}