export default class BarQTE extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'barQTE'});

        this.speed = 400;
        this.danio = 100; 
    }
    //inicializacion de escenas
    init (){
        this.result = false;
    }
    //carga de imagenes, sonidos y recursos
    preload(){
        

    }
    //creacion de objetos en la escena
    
    create() {
        
        this.espacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.timeleft = this.time.delayedCall(6000, () => {
            console.log("Fallo");
            this.scene.start('mainMenu');
        })

        let position = Phaser.Math.Between(128, 528);
        console.log(position);

        this.fondo2 = this.add.image(328, 188, 'playerCube');
        this.fondo2.setDisplaySize(656, 376);
        
        this.bad = this.physics.add.image(328, 150, 'darkBlue');
        this.bad.body.setAllowGravity(false);
        this.bad.setDisplaySize(600, 30);
        
        this.mid = this.physics.add.image(position, 150, 'lightBlue');
        this.mid.body.setAllowGravity(false);
        this.mid.setDisplaySize(100, 30);

        this.good = this.physics.add.image(position, 150, 'yellow');
        this.good.body.setAllowGravity(false);
        this.good.setDisplaySize(50, 30);

        this.bar = this.physics.add.image(328, 150, 'bar');
        this.bar.body.setAllowGravity(false);
        this.bar.setDisplaySize(5, 40);
        this.bar.setVelocity(-this.speed, 0);
        this.bar.body.setSize(5,5);

        this.timeOnScreen = 5;

        this.textoTiempo = this.add.text(20, 20, 'Tiempo: 0', {
            fontSize: '30px', color: '#000000'
        })

    }

    //actualizacion repetida mientras la escena esta activa
    update(time, delta){
        this.timeOnScreen -= delta / 1000;
        this.textoTiempo.setText('Tiempo: ' + Math.floor(this.timeOnScreen));

        if (Phaser.Input.Keyboard.JustDown(this.espacio)) {
        //Para la barra
        this.bar.setVelocity(0, 0);
        this.result = true;

        // Comprobar colisiones con good
            if(this.physics.collide(this.bar, this.good)) {
                console.log("Hay colisión con Good");
                this.danio = this.danio * 1;
                console.log(this.danio);
            }

        // Comprobar colisiones con mid
            else if (this.physics.collide(this.bar, this.mid)) {
                console.log("Hay colisión con Mid");
                this.danio = this.danio * 0.5;
                console.log(this.danio);
            }

        //Comprobar colisiones con bad
            else if (this.physics.collide(this.bar, this.bad)) {
                console.log("Hay colisión con Bad");
                this.danio = this.danio * 0;
                console.log(this.danio);
            }


        }

        if(this.result){
            this.time.delayedCall(1500, () => {
                console.log("1,5 segundos despues del ataque");
                this.scene.start('mainMenu');
            })

            this.timeleft.remove();
        }


    if (this.bar.x >= 600) {
        this.bar.setVelocity(-this.speed, 0);
    }

    if (this.bar.x <= 56) {
        this.bar.setVelocity(this.speed, 0);
    }

    }




}