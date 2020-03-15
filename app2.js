// import GameMap from "./src/classes/gameMap";

class Game {
    constructor(){
        this.renderer = new Renderer();
        this.items = [];
        this.gameMap;
        this.setup();
    }
    
    setup(){
        // this.gameMap = new GameMap(new MapGenerator().generate(MapSize, new SimplexNoise(), progressBar)); //218  - 256 are good Sizes for visibility and reduced blur.

        this.items.push(new item("axe", 64, 64, "./assets/img/axe.png"))
    }

    loop(){
        this.renderer.render(this.items);
    }
}

class Renderer {
    constructor(){
        this.canvas = document.getElementById('game').getContext('2d');
    }
    render(items){
        items.forEach(item => {
            item.render(this.canvas);
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

class item extends GameObject {
    constructor(name, x, y, img){
        super(name, x, y, img);
    }
}

onload = () => {
    let game = new Game();
    setInterval(() => {
        game.loop();
    }, 16);
}