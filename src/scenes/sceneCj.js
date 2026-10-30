// contiene escena de Prueba de Cristopher
import PlayerMap from '../playerMap.js';
import LevelPad from '../levelPad.js';

export default class SceneCj extends Phaser.Scene{
    constructor(){
        //constructor del padre
        super ({key: 'sceneCj'});
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
            this.levelPad1.NextLevel('mainMenu') //LLama al método del tipo consumible
        });
    }

    //actualizacion repetida mientras la escena esta activa
    update() {
        
    }




}