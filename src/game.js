//configura e inicia Phaser

import Scene1 from './scenes/scene1.js';
import SceneCj from './scenes/sceneCj.js';

let config = {
    type: Phaser.AUTO,
    parent: 'juego-phaser',
    width: 656,
    height: 376,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        mode: Phaser.Scale.FIT,
        min: {
            width: 328,
            height: 188
        },
        max: {
            width: 1312,
            height: 752
        },
        zoom: 1
    },

    //nombre de nuestra primera escena
    scene: [SceneCj], 
    //fisicas del ejemplo
    physics: {  
        default: 'arcade', //Tenemos físicas simple, arcade
        arcade: { 
            gravity: { y: 200 }, //Tenemos gravedad, podemos modificarla para aumentar su fuera o disminuirla
            debug: true // Aquí indicamos si queremos que Phaser pinte los cuerpos y fuerzas de los objetos con físicas
        },
        checkCollision: {
            up: true,
            down: true,
            left: true,
            right: true
        }
    },
    title: "ejercicio opcional",
    version: "1.0.0"
};

new Phaser.Game(config);