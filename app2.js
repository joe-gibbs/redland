import GameMap from "./src/classes/gameMap.js";
import MapGenerator from "./src/classes/mapGenerator.js";


class Game {
    constructor(){
        this.Renderer = new Renderer();
        // this.Controller = new Controller();
        this.InputHandler = new InputHandler();

        this.gameMap;
        this.MapSize = 256;

        this.gameObjects = [];
        this.items = [];
        this.actor;
        this.setup();
    }
    
    setup(){
        this.gameMap = new GameMap(new MapGenerator().generate(this.MapSize, new SimplexNoise()));
        console.log(this.gameMap)

        this.gameObjects.push(new Player("player", 0, 0, "./assets/img/blueberry.png", 10, 100));
        this.items.push(new Item("axe", 64, 64, "./assets/img/axe.png"));
        this.gameObjects.push(this.items);
        // console.log(this.gameObjects)

        window.addEventListener('keydown', (event) => {
            this.InputHandler.keyPresses[event.key] = true;
            console.log(this.InputHandler.keyPresses)
        });
        window.addEventListener('keyup', (event) => {
            this.InputHandler.keyPresses[event.key] = false;
        });
    }

    loop(){
        // this.InputHandler.handleInput();
        // this.update();
        // this.Controller.update(this.InputHandler, this.gameObjects[0]);
        this.Renderer.render(this.gameObjects);
    }
}

class Controller{
    constructor(){
    }
    update(inputHandler, player){
        let command = inputHandler.handleInput();
        if(command) command.execute(player)
    }
}



class InputHandler{
    constructor(){
        //this.moveLeft = new Command(player, player)
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
        this.actor = actor
    }
    execute(){}
}
class MoveLeft extends Command{
    execute(actor){
        actor.move()//specify how the actor takes the input and actually moves. 
    }
}
class MoveRight extends Command{
    execute(actor){
        actor.move()
    }
}
class MoveUp extends Command{
    execute(actor){
        actor.move()
    }
}
class MoveDown extends Command{
    execute(actor){
        actor.move()
    }
}




class Renderer {
    constructor(){
        this.canvas = document.getElementById('game').getContext('2d');
    }
    render(gameObjects){
        gameObjects.forEach(object => {
            if(Array.isArray(object)){
                object.forEach(element => {element.render(this.canvas)});
            } else {
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
    setInterval(() => {
        game.loop();
    }, 16);
}