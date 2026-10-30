// contiene escena de Prueba de Cristopher
import PlayerMap from '../MiniMapClasses/playerMap.js';
import LevelPad from '../MiniMapClasses/levelPad.js';

export default class MiniMap extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'minimap'});
    }
    //inicializacion de escenas
    init (){
    }
    //carga de imagenes, sonidos y recursos
    preload(){
    }
    //creacion de objetos en la escena
    create() {
        this.background = this.add.image(-40,0, 'miniMapBack').setOrigin(0, 0);
        this.background.setDisplaySize(700, 400);
        this.physics.world.setBounds(50, 95, 565, 260);

        this.playerCube = new PlayerMap(this, 100, 150, 'playerCube');
        this.levelPad1 = new LevelPad(this, 172, 300, 'levelPadColor');

        this.physics.add.collider(this.playerCube, this.levelPad1, (PlayerMap, LevelPad) =>{
            this.levelPad1.NextLevel('barQTE') //LLama al método del tipo consumible
        });
    }

    //actualizacion repetida mientras la escena esta activa
    update() {
        
    }




}