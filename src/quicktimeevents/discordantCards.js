export default class QTECards extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);

        this.scene.add.existing(this);

        this.setInteractive();
        this.setDisplaySize(125, 150);

        this.texto = this.scene.add.text(x, 170, 'Coso', {
            fontSize: '30px', color: '#000000'
        }).setOrigin(0.5, 0)
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    changeText(newText){
        this.texto.setText(newText);
    }

}