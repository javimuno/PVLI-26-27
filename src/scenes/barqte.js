export default class BarQTE extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'barQTE'});
    }
    //inicializacion de escenas
    init (data){
        this.dificultad = data.nombre;
    }

    //creacion de objetos en la escena
    create() {
        
        this.espacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.speed = 400;
        this.result = false;
        this.calidad = 'fallo';
        this.xAzul = 200;

        this.fondo2 = this.add.image(328, 188, 'playerCube');
        this.fondo2.setDisplaySize(656, 376);

        this.timeleft = this.time.delayedCall(5000, () => {
            console.log("Fallo");
            this.result = true;
            this.bar.setVelocity(0, 0);

        })

        //Construye el QTE
        
        this.buildBar(this.selectDificultad(this.dificultad));

        //Consrtuye la barra de tiempo
        this.inicializarBarraTiempo();

    }

    //actualizacion repetida mientras la escena esta activa
    update(time, delta){

        if(this.result != true)
        {
            //Barra tiempo
            this.insideBar.width -= delta / 10;
            this.color = Phaser.Display.Color.Interpolate.ColorWithColor(this.red, this.green, 1, this.insideBar.width / 600);
            this.insideBar.setFillStyle(Phaser.Display.Color.GetColor(this.color.r, this.color.g, this.color.b));

            if (Phaser.Input.Keyboard.JustDown(this.espacio)) {this.checkCollision()}

            if (this.bar.x >= 618) {
                this.bar.setVelocity(-this.speed, 0);
            }

            if (this.bar.x <= 38) {
                this.bar.setVelocity(this.speed, 0);
            }
        }

        else
        {
            this.finEvento();
        }
    }

    buildBar(xAzul)
    {
        //Instrucciones
        this.textoCorrecto = this.add.text(328, 88, 'PARALO', {
            fontSize: '40px', color: '#000000', fontStyle: 'bold'
        }).setOrigin(0.5, 0)

        if(xAzul > 300)
        {
            xAzul = 300;
        }
        else if(xAzul < 1)
        {
            xAzul = 50;
        }
        //Barra
        let position = Phaser.Math.Between(xAzul + 28, 628 - xAzul);
        console.log(position);

        this.bad = this.physics.add.image(328, 150, 'darkBlue');
        this.bad.body.setAllowGravity(false);
        this.bad.setDisplaySize(600, 30);
        
        this.mid = this.physics.add.image(position, 150, 'lightBlue');
        this.mid.body.setAllowGravity(false);
        this.mid.setDisplaySize(xAzul, 30);

        this.good = this.physics.add.image(position, 150, 'yellow');
        this.good.body.setAllowGravity(false);
        this.good.setDisplaySize(xAzul/2, 30);

        this.bar = this.physics.add.image(328, 150, 'bar');
        this.bar.body.setAllowGravity(false);
        this.bar.setDisplaySize(5, 40);
        this.bar.setVelocity(-this.speed, 0);
        this.bar.body.setSize(5,5);

    }

    checkCollision()
    {
        //Para la barra
        this.bar.setVelocity(0, 0);
        this.result = true;

        // Comprobar colisiones con good
        if(this.physics.collide(this.bar, this.good)) {
            this.calidad = 'perfecto';
        }

        // Comprobar colisiones con mid
        else if (this.physics.collide(this.bar, this.mid)) {
            this.calidad = 'bien';
        }

        //Comprobar colisiones con bad
        else if (this.physics.collide(this.bar, this.bad)) {
            this.calidad = 'fallo';
        }

        console.log(this.calidad);
    }

    inicializarBarraTiempo()
    {
        this.green = Phaser.Display.Color.ValueToColor(0x95ff00);
        this.red = Phaser.Display.Color.ValueToColor(0xff0000);

        this.insideBar = this.add.rectangle(325, 38, 600, 32, 0x95ff00);
        this.add.image(328, 37, 'barTime');
    }

    selectDificultad(dificultad)
    {
        this.xAzul = 50;
        if(dificultad === 'facil')
        {
            this.xAzul = 200;
        } 
        else if(dificultad === 'medio')
        {
            this.xAzul = 100;
        }
        else if(dificultad === 'dificil')
        {
            this.xAzul = 50;
        }
    }

    finEvento()
    {
        this.bar.setVelocity(0, 0);
        this.timeleft.remove();
        
        this.time.delayedCall(1500, () => 
        {
            console.log("1,5 segundos despues del ataque");

            this.scene.start('mainMenu' /*,{calidad: this.calidad}*/);
        });
    }
}
