export default class PlayerMap extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);

        this.scene.add.existing(this)
        this.setDisplaySize(45,45);
        this.scene.physics.add.existing(this);
        this.body.setSize(10, 30);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    
    preUpdate(t, dt){
        super.preUpdate(t, dt);

        if(this.cursors.down.isDown){
            this.body.setVelocity(0, 100);
        }else if(this.cursors.up.isDown){
            this.body.setVelocity(0, -100);
        }else if(this.cursors.left.isDown){
            this.body.setVelocity(-100, 0);
            this.setFlipX(true);
        }else if(this.cursors.right.isDown){
            this.body.setVelocity(100, 0);
            this.setFlipX(false);
        }else{
            this.body.setVelocity(0, 0);
        }
    }
}