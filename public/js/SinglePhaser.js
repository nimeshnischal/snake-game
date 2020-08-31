import MainScene from './MainScene.js';

const config = {
    width: window.screen.availWidth * 0.99,
    height: window.screen.availHeight * 0.85,
    type: Phaser.AUTO,  // Canvas or WebGL
    parent: 'snake-game',  // where to place the game in html
    scene: [MainScene]
};

new Phaser.Game(config);