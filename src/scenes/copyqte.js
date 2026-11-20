export default class CopyQTE extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'copyQTE'});

    }
    //inicializacion de escenas
    init (){
        
    }
    //carga de imagenes, sonidos y recursos
    preload(){
        

    }
    //creacion de objetos en la escena
    
    create() {
        this.cursor = this.input.keyboard.createCursorKeys();

        let position = Phaser.Math.Between(1, 4);

        this.timeleft = this.time.delayedCall(5000, () => {
            console.log("Fallo");
            this.scene.start('combat');
        })

        this.terminado = false;

        this.fondo2 = this.add.image(328, 188, 'playerCube');
        this.fondo2.setDisplaySize(656, 376);

        //primera flecha
        this.green1 = this.physics.add.image(131, 188, 'green');
        this.green1.body.setAllowGravity(false);
        this.green1.setDisplaySize(90, 90);
        this.green1.setVisible(false);

        this.arrow1 = this.physics.add.image(131, 188, 'arrow');
        this.arrow1.body.setAllowGravity(false);
        this.arrow1.setDisplaySize(60, 30);

        //segunda flecha
        this.green2 = this.physics.add.image(262, 188, 'green');
        this.green2.body.setAllowGravity(false);
        this.green2.setDisplaySize(90, 90);
        this.green2.setVisible(false);

        this.arrow2 = this.physics.add.image(262, 188, 'arrow');
        this.arrow2.body.setAllowGravity(false);
        this.arrow2.setDisplaySize(60, 30);
        
        //tercera flecha
        this.green3 = this.physics.add.image(393, 188, 'green');
        this.green3.body.setAllowGravity(false);
        this.green3.setDisplaySize(90, 90);
        this.green3.setVisible(false);

        this.arrow3 = this.physics.add.image(393, 188, 'arrow');
        this.arrow3.body.setAllowGravity(false);
        this.arrow3.setDisplaySize(60, 30);

        //cuarta flecha
        this.green4 = this.physics.add.image(524, 188, 'green');
        this.green4.body.setAllowGravity(false);
        this.green4.setDisplaySize(90, 90);
        this.green4.setVisible(false);

        this.arrow4 = this.physics.add.image(524, 188, 'arrow');
        this.arrow4.body.setAllowGravity(false);
        this.arrow4.setDisplaySize(60, 30);

        //Dirreccion de las flechas
        this.direccion1 = this.aleatorio(this.arrow1);
        this.direccion2 = this.aleatorio(this.arrow2);
        this.direccion3 = this.aleatorio(this.arrow3);
        this.direccion4 = this.aleatorio(this.arrow4);

        //Juntarlos en arrays
        this.direccion = [
        this.direccion1,
        this.direccion2,
        this.direccion3,
        this.direccion4
        ];

        this.green = [
        this.green1,
        this.green2,
        this.green3,
        this.green4
        ];

        this.step = 0;

        this.timeOnScreen = this.add.text(20, 20, 'Tiempo: 5.0', {
        fontSize: '30px',
        color: '#000000'
        });

    }

    //actualizacion repetida mientras la escena esta activa
    update(time, delta)
    {
        if (this.terminado) {
            return;
        }

        this.timeOnScreen.setText('Tiempo: ' + Math.ceil(this.timeleft.getRemainingSeconds()));

        if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {

            if (this.direccion[this.step] == 1) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {

            if (this.direccion[this.step] == 2) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

            if (this.direccion[this.step] == 3) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {

            if (this.direccion[this.step] == 4) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }
        if (this.step === 4 && !this.terminado) {
            this.terminado = true;
            this.timeleft.remove();
            this.time.delayedCall(1500, () => {
            this.scene.start('combat');
        });
    }


    }

    reiniciar() 
    {
        this.green1.setVisible(false);
        this.green2.setVisible(false);
        this.green3.setVisible(false);
        this.green4.setVisible(false);

        this.step = 0;
    }

    aleatorio(flecha)
    {
        let num = Phaser.Math.Between(1, 4);

        if (num == 1) {
            flecha.setRotation(Math.PI / 2); // Abajo
        }
        else if (num == 2) {
            flecha.setRotation(0); // Derecha
        }
        else if (num == 3) {
            flecha.setRotation(Math.PI * 1.5); // Arriba
        }
        else if (num == 4) {
            flecha.setRotation(Math.PI); // Izquierda
        }  

        return num;
    }
}