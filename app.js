const canvas = document.querySelector('#game').getContext("2d");
let CANVAS_WIDTH = window.innerWidth;
let CANVAS_HEIGHT = window.innerHeight;
const WATER_RATIO = 0.3;

const terrain = {
    "LAND": {
        walkable: true,
        tile: new Image(),
    },
    "WATER": {
        walkable: false,
        tile: new Image(),
    },
    "FOREST": {
        walkable: false,
        tile: new Image(),
    },
    "SAND": {
        walkable: true,
        tile: new Image(),
    }
}
terrain.LAND.tile.src = './assets/img/grass.png';
terrain.WATER.tile.src = './assets/img/water.png';
terrain.FOREST.tile.src = './assets/img/forest.png';
terrain.SAND.tile.src = './assets/img/forest.png';
Object.freeze(terrain); //Turns into an enum

class GameMap {
    constructor(tiles) {
        this.tiles = tiles;
    }

    setTile(x, y, terrainType) {
        this.tiles[x][y].type = terrainType;
    }

    chooseRandomTile(terrain)
    {
        function randomIndex(length) {
            return Math.round(Math.random() * (length - 0) + 0);
          }

        let tile = this.tiles[randomIndex(this.tiles.length)][randomIndex(this.tiles.length)];        

        while (tile.type != terrain) {
            tile = this.tiles[randomIndex(this.tiles.length)][randomIndex(this.tiles.length)];
        }
        return tile;
    }
}

class Tile {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = './assets/img/player.png';
        this.resources = {
            wood: 0,
            food: 10,
            stone: 0,
        };
        this.tools = {
            axe: false,
            shovel: false,
            boat: false,
        };
        this.health = 100;
    }

    move(x,y, map) {        
        if (map.tiles[this.x + x][this.y + y].type.walkable) {
            this.x += x;
            this.y += y;
        }

        return map.tiles[this.x][this.y];
    }
}

class MapGenerator {
    constructor() {
    }

    create2DArray(rows) {
        var arr = [];
      
        for (var i=0;i<rows;i++) {
           arr[i] = [];
        }
      
        return arr;
      }
    
    normalise(val, max, min) { return (val - min) / (max - min); }    
    
    generate(size, simplex) {
        let data = this.create2DArray(size);
        
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let val = (((simplex.noise2D(x / 500, y / 500)) - .7) + (((simplex.noise2D(x / 80, y / 80)) / 1.5) + ((Math.abs(simplex.noise2D(x / 20, y / 20) / 5))))) * 100;
                data[x][y] = val < 0 ? new Tile(terrain.WATER, x, y) : new Tile(terrain.LAND, x ,y);
            }
        }

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let val = this.normalise(simplex.noise2D(x / 12, y / 12), 0, 1);
                if (val < 0.9) {
                    if (data[x][y].type === terrain.LAND) {
                        data[x][y].type = terrain.FOREST;
                    }
                }
            }
        }        
        return data;
    }
}

//Main function, put stuff here
window.onload = function() {
    let map;
    let centerTile;
    let player;

    function handleKeyPress(event)
    {
        event.preventDefault();
        
        switch (event.keyCode) {
            case 37: //left
                centerTile = player.move(1, 0, map)
                break;
            case 38: //up
                centerTile = player.move(0, 1, map)
                break;
            case 39: //right
                centerTile = player.move(-1, 0, map)
                break;
            case 40: //down
                centerTile = player.move(0, -1, map)
                break;
            default:
                break;
        }        
    }

    //Setup
    function setup() {
        let gameCanvas = document.querySelector('#game');
        
        gameCanvas.width = CANVAS_WIDTH;
        gameCanvas.height = CANVAS_HEIGHT;
    
        //Add colour to canvas
        canvas.fillColor = 'black';
        canvas.fillRect(0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
        
        map = new GameMap(new MapGenerator().generate(1024, new SimplexNoise()));
        
        centerTile = map.chooseRandomTile(terrain.LAND);

        player = new Player(centerTile.x, centerTile.y);

        window.addEventListener("keydown", handleKeyPress);
    }


    function update() {
        CANVAS_WIDTH = window.innerWidth;
        CANVAS_HEIGHT = window.innerHeight;
    }

    function drawUi() {
        let resourceIcon = new Image();
        resourceIcon.src = './assets/img/resource.png';

        let uiX = Math.ceil(CANVAS_WIDTH/1.5 / 64.0) * 64;
        let uiY = Math.ceil(CANVAS_HEIGHT/80 / 64.0) * 64;

        canvas.drawImage(resourceIcon, uiX, uiY);
    }
    
    function draw() { 
        let tiles = Math.round(Math.max(CANVAS_HEIGHT, CANVAS_WIDTH) / 64);
        if (tiles % 2 != 0) {
            tiles++;
        }        

        let renderableTiles = new MapGenerator().create2DArray(tiles);
        for (let x = 0; x < tiles; x++) {
            for (let y = 0; y < tiles; y++) {
                let xcoord = centerTile.x - (x - tiles/2);
                let ycoord = centerTile.y - (y - tiles/2);
                renderableTiles[x][y] = map.tiles[xcoord][ycoord];
            }
        }
        
        for (let x = 0; x < renderableTiles.length; x++) {
            for (let y = 0; y < renderableTiles.length; y++) {
                let tile = renderableTiles[x][y];
                    canvas.drawImage(tile.type.tile, x*64, y*64)
            }  
        }
        canvas.drawImage(player.image, (tiles/2)*64, (tiles/2)*64);
        drawUi();
    }

    function loop() {
        update();
        draw();
    }

    setup();

    window.setInterval(function(){
        loop();
    }, 16);
};


/* TEXTING
 https://github.com/josephg/noisejs

 
*/