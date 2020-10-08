import {Application, Sprite, Loader, Graphics, Container} from 'pixi.js';
import * as PixiSound from 'pixi-sound';
import Peer from 'peerjs';
const sound = PixiSound.default.sound;

// Set up the app.
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

let app = new Application({
    width: SCREEN_WIDTH, 
    height: SCREEN_HEIGHT, 
    backgroundColor : 0x1099bb
});
document.body.appendChild(app.view);


const loader = new Loader();
loader.add('song', 'sound/song.mp3')

    .add('knight', 'img/knight.png')

loader.load((loader, resources) => {
    init(loader, resources);
})

const init = (loader, resources) => {
    let {
        song,
        knight,
    } = resources;

    // song.sound.play();


    knight = new Sprite(knight.texture);
    knight.anchor.set(0.5);
    knight.x = SCREEN_WIDTH / 2;
    knight.y = SCREEN_HEIGHT / 2;
    app.stage.addChild(knight);

    let redSquareContainer = new Container();

    let redSquare = new Graphics();
    redSquare.beginFill(0xFF0000);
    redSquare.drawRect(0, 0, 100, 100);
    redSquare.drawRect(100, 100, 100, 100);
    redSquare.endFill();
    
    redSquareContainer.addChild(redSquare);
    app.stage.addChild(redSquareContainer);
}