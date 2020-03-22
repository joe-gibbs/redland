import GameMap from "./src/classes/gameMap.js";
import MapGenerator from "./src/classes/mapGenerator.js";
import terrain from './src/terrain.js';

//This file has all classes and funcitonality associated to the game except for the files imported above. 


class Game {
    constructor(){
        this.Renderer = new Renderer(64);
        this.Controller = new Controller();
        this.InputHandler = new InputHandler();

        this.GameMap;
        this.centerTile;
        this.MapSize = 256;

        this.gameObjects = [];
        this.items = [];
        this.actor;
        this.setup();
    }
    
    setup(){
        this.GameMap = new GameMap(new MapGenerator().generate(this.MapSize));
        this.Renderer.updateCanvasDimensions();

        try {
            this.centerTile = this.GameMap.chooseRandomTile(terrain.LAND);
        } catch{
            this.setup();
        }

        this.gameObjects.push(new Player("player", 0, 0, "./assets/img/player.png", 10, 100));
        this.items.push(new Item("blueberry", 128, 128, "./assets/img/blueberry.png"));
        // this.items.push(new Item("pick", 0, 0 , "./assets/img/pick.png"));
        // this.gameObjects.push(this.items);
        // console.log(this.gameObjects)
        

        window.addEventListener('keydown', (event) => {
            this.InputHandler.keyPresses[event.key] = true;
            // console.log(this.InputHandler.keyPresses)
        });
        window.addEventListener('keyup', (event) => {
            this.InputHandler.keyPresses[event.key] = false;
        });
    }

    loop(){
        // this.InputHandler.handleInput();
        this.Controller.update(this.Renderer);
        this.Renderer.render(this.gameObjects, this.GameMap, this.centerTile);
        requestAnimationFrame(() => {
            this.loop();
        });
    }
}

class Controller{
    update(Renderer){
        Renderer.updateCanvasDimensions();
        // let command = command
        // if(command) command.execute(player)
    }
}

class InputHandler{
    constructor(){
        // this.moveLeft = new MoveLeft(player)
        this.keyPresses = {};
    }
    handleInput(){
        //if(keydown or whatever (leftArrowKey)) return this.moveLeft
        if(this.keyPresses.ArrowLeft){

        } else if(this.keyPresses.ArrowRight){

        }
        if(this.keyPresses.ArrowUp){

        } else if(this.keyPresses.ArrowDown){

        }
    }
}
class Command{  
    constructor(actor){
        this.actor = actor;
    }
    execute(){}
}
class MoveLeft extends Command{
    execute(){
        this.actor.move()//specify how the actor takes the input and actually moves. 
    }
}
class MoveRight extends Command{
    execute(){
        this.actor.move()
    }
}
class MoveUp extends Command{
    execute(actor){
        this.actor.move()
    }
}
class MoveDown extends Command{
    execute(actor){
        actor.move()
    }
}


class Renderer {
    constructor(tileSize){
        this.canvasElement = document.getElementById('game');
        this.canvasElement.style.display = "block"; 
        this.canvas = this.canvasElement.getContext('2d');
        this.numXTiles, this.numYTiles;
        this.tileOffset = 4;
        this.tileSize = tileSize;
        this.renderableTiles = [];
    }

    updateCanvasDimensions(){
        this.canvasElement.width = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
        this.canvasElement.font = (this.canvasElement.width + this.canvasElement.health) / 92 + "px Pixelated";
        this.canvas.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        //updates the number of tiles that fit in the canvas for rendering.
        this.numXTiles =  Math.ceil((this.canvasElement.width) / this.tileSize);
        this.numYTiles =  Math.ceil((this.canvasElement.height) / this.tileSize);
        if (this.numXTiles % 2 != 0) {
            this.numXTiles++;
        }
        
        if (this.numYTiles % 2 != 0) {
            this.numYTiles++;
        }

    }

    renderGameMap(GameMap, centerTile){
        //this should be moved to controller. 
        for (let i = 0; i < this.numXTiles + 4; i++) {  // Create 2 dimensional array
            this.renderableTiles[i] = [];        //
        }

        function calculateX(x, tileSize) {
            return Math.ceil(x * tileSize - tileSize); //these are centering adjustments to where the centertile and all other tiles will actually be rendered. +/- depending on which tile is considered more in the middle. They need to be adjusted with the actual rendring x and ys. 
        }
        function calculateY(y, tileSize) {
            return Math.ceil(y * tileSize + tileSize * 2);
        }
        for (let x = 0; x < this.numXTiles + this.tileOffset; x++) {
            for (let y = 0; y < this.numYTiles + this.tileOffset; y++) {
                let xcoord = centerTile.x - (x - this.numXTiles/2);
                let ycoord = centerTile.y - (y - this.numYTiles/2);
                if ((GameMap.tiles[x+1]||[])[y] && ((GameMap.tiles[xcoord + 1] || [])[ycoord + 1])) {
                    this.renderableTiles[x][y] = GameMap.tiles[xcoord][ycoord];
                }
                else {
                    this.renderableTiles[x][y] = null;
                }
            }
        }
        for (let x = 0; x < (this.numXTiles + 2); x++) {
            for (let y = 0; y < (this.numYTiles + 2); y++) {
                if ((this.renderableTiles[x]||[])[y]) {
                    let currentTile = this.renderableTiles[x][y];
                    currentTile.type.sprite.render(0, calculateX(x, this.tileSize), calculateY(y, this.tileSize), this.canvas);
                }
            }
        }
    }

    render(gameObjects, GameMap, centerTile){
        this.renderGameMap(GameMap, centerTile);

        gameObjects.forEach(object => {
            console.log(object)
            if(Array.isArray(object)){
                object.forEach(element => {element.render(this.canvas)});
            } else {
                if(object.name === "player"){
                    object.x = (this.numXTiles/2) * this.tileSize - this.tileSize;
                    object.y = (this.numYTiles/2) * this.tileSize;
                }
                object.render(this.canvas);
            }
        });
    }
}


class GameObject {
    constructor(name, x, y, img){   
        this.name = name;
        this.x = x;
        this.y = y; 
        this.img = new Image();
        this.img.src = img; 
    }
    render(canvas){
        canvas.drawImage(this.img, this.x, this.y);
    }
}
class Item extends GameObject {
    constructor(name, x, y, img){
        super(name, x, y, img);
    }
}
class Actor extends GameObject {
    constructor(name, x, y, img, speed, health){
        super(name, x, y, img);
        this.speed = speed;
        this.direction = [0, 1];
        this.movement = [0, 0];
        this.health = health;
    }
    move(){
        //specify how we are going to move any actors in the game.
        // need this to plug in the iinput handler and connect the player movement
    }
}
class Player extends Actor{
    constructor(name, x, y, img, speed, health){
        super(name, x, y, img, speed, health);
    }
    pickup(){
    }
}


onload = () => {
    let game = new Game();
    requestAnimationFrame(() => {
        game.loop();
    });
}