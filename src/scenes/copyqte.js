export default class CopyQTE extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'copyQTE'});

    }

    //inicializacion de escenas
    init (data)
    {
        this.dificultad = data.nombre;  
    }

    //creacion de objetos en la escena    
    create() {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.terminado = false;
        this.calidad = 'mal';

        this.fondo2 = this.add.image(328, 188, 'playerCube');
        this.fondo2.setDisplaySize(656, 376);

        this.timeleft = this.time.delayedCall(5000, () => {
            console.log("Fallo");
            this.scene.start('mainMenu'/*, {calidad: this.calidad}*/);
        })
        
        this.direccion = [];
        this.green = [];
        this.arrow = [];

        this.nFlechas = this.selectDificultad(this.dificultad);
        this.consrtuirFlechas(this.nFlechas);

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

            if (this.direccion[this.step] == 0) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {

            if (this.direccion[this.step] == 1) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

            if (this.direccion[this.step] == 2) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {

            if (this.direccion[this.step] == 3) {
                this.green[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }
        if (this.step === this.nFlechas && !this.terminado) {
            this.terminado = true;
            this.calidad = 'Perfecto';
            this.timeleft.remove();
            this.time.delayedCall(1500, () => {
            this.scene.start('mainMenu'/*, {calidad: this.calidad}*/);
            //this.scene.stop();
            //this.finalizar(this.calidad);
        });
    }


    }

    reiniciar() 
    {
        for(let i = 0; i < this.nFlechas; i++) {this.green[i].setVisible(false);}

        this.step = 0;
    }

    aleatorio(flecha)
    {
        let num = Phaser.Math.Between(0, 3);

        if (num == 0) {
            flecha.setRotation(Math.PI / 2); // Abajo
        }
        else if (num == 1) {
            flecha.setRotation(0); // Derecha
        }
        else if (num == 2) {
            flecha.setRotation(Math.PI * 1.5); // Arriba
        }
        else if (num == 3) {
            flecha.setRotation(Math.PI); // Izquierda
        }  

        return num;
    }

    consrtuirFlechas(nFlechas)
    {
        this.x = 656 / (this.nFlechas + 1);
        for(let i = 0; i < this.nFlechas; i++)
        {
            this.green[i] = this.physics.add.image(this.x * (i + 1), 188, 'green');
            this.green[i].body.setAllowGravity(false);
            this.green[i].setDisplaySize(90, 90);
            this.green[i].setVisible(false);

            this.arrow[i] = this.physics.add.image(this.x * (i + 1), 188, 'arrow');
            this.arrow[i].body.setAllowGravity(false);
            this.arrow[i].setDisplaySize(60, 30);

            this.direccion[i] = this.aleatorio(this.arrow[i]);
        }

    }

    selectDificultad(dificultad)
    {
        this.numFlechas = 4;
        if(dificultad === 'Facil')
        {
            this.numFlechas = 3;
        } 
        else if(dificultad === 'Medio')
        {
            this.numFlechas = 4;
        }
        else if(dificultad === 'Dificil')
        {
            this.numFlechas = 5;
        }
        return this.numFlechas;
    }
}