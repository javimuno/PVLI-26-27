export default class LevelPad extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.setDisplaySize(45,45);
        this.scene.physics.add.existing(this);
        this.body.allowGravity = false;
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    NextLevel(scenaNombre){
        this.scene.scene.start(scenaNombre);
    }

}