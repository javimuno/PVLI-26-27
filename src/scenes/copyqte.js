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
            this.finEvento();
        })
        
        this.direccion = [];
        this.greenBox = [];
        this.arrow = [];

        this.nFlechas = this.selectDificultad(this.dificultad);
        this.consrtuirFlechas(this.nFlechas);
        this.inicializarBarraTiempo();

        this.step = 0;
    }

    //actualizacion repetida mientras la escena esta activa
    update(time, delta)
    {
        if (this.terminado) {
            return;
        }

        //Barra tiempo
        this.insideBar.width -= delta / 10;
        this.color = Phaser.Display.Color.Interpolate.ColorWithColor(this.red, this.green, 1, this.insideBar.width / 600);
        this.insideBar.setFillStyle(Phaser.Display.Color.GetColor(this.color.r, this.color.g, this.color.b));

        if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {

            if (this.direccion[this.step] == 0) {
                this.greenBox[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {

            if (this.direccion[this.step] == 1) {
                this.greenBox[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

            if (this.direccion[this.step] == 2) {
                this.greenBox[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }

        else if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {

            if (this.direccion[this.step] == 3) {
                this.greenBox[this.step].setVisible(true);
                this.step++;
            }
            else {
                this.reiniciar();
            }

        }
        if (this.step === this.nFlechas && !this.terminado) {
            this.calidad = 'Perfecto';
            this.finEvento();
        }


    }

    reiniciar() 
    {
        for(let i = 0; i < this.nFlechas; i++) {this.greenBox[i].setVisible(false);}

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
            this.greenBox[i] = this.physics.add.image(this.x * (i + 1), 188, 'green');
            this.greenBox[i].body.setAllowGravity(false);
            this.greenBox[i].setDisplaySize(90, 90);
            this.greenBox[i].setVisible(false);

            this.arrow[i] = this.physics.add.image(this.x * (i + 1), 188, 'arrow');
            this.arrow[i].body.setAllowGravity(false);
            this.arrow[i].setDisplaySize(60, 30);

            this.direccion[i] = this.aleatorio(this.arrow[i]);
        }

        console.log(this.nFlechas);

    }

    selectDificultad(dificultad)
    {
        this.numFlechas = 4;
        if(dificultad === 'facil')
        {
            this.numFlechas = 3;
        } 
        else if(dificultad === 'medio')
        {
            this.numFlechas = 4;
        }
        else if(dificultad === 'dificil')
        {
            this.numFlechas = 5;
        }
        return this.numFlechas;
    }

    inicializarBarraTiempo()
    {
        this.green = Phaser.Display.Color.ValueToColor(0x95ff00);
        this.red = Phaser.Display.Color.ValueToColor(0xff0000);

        this.insideBar = this.add.rectangle(325, 60, 600, 32, 0x95ff00);
        this.add.image(328, 59, 'barTime');
    }

    finEvento()
    {
        this.terminado = true;
        this.time.delayedCall(1500, () => {
                console.log("1,5 segundos despues del ataque");

                this.scene.start('mainMenu' /*,{calidad: this.calidad}*/);
            });

            this.timeleft.remove();
    }
}