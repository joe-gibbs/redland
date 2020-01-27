const canvas = document.querySelector('#game').getContext("2d");
const WATER_RATIO = 0.3;
const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const RESOURCE_ICON = document.getElementById('resource');
const WATER_TILE = document.getElementById('water');
const GRASS_TILE = document.getElementById('grass');
const FOREST_TILE = document.getElementById('forest');
const PLAYER_TILE = document.getElementById('player');

const terrain = {
    "LAND": {
        walkable: true,
    },
    "WATER": {
        walkable: false,
    },
    "FOREST": {
        walkable: false,
    },
}
Object.freeze(terrain); //Turns into an enum

class GameMap {
    constructor(tiles) {
        this.tiles = tiles;
    }

    print() {
        //canvas.putImageData(imageData, 0, 0);
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
    
    generate(size, simplex) {
        let data = this.create2DArray(size);
        
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let val = (((simplex.noise2D(x / 500, y / 500)) - .7) + (((simplex.noise2D(x / 80, y / 80)) / 1.5) + ((Math.abs(simplex.noise2D(x / 20, y / 20) / 5))))) * 100;
                data[x][y] = val < 0 ? new Tile(terrain.WATER, x, y) : new Tile(terrain.LAND, x ,y);
            }
        }
        console.log(data);
        
        return data;
    }
}

//Main function, put stuff here
window.onload = function() {
    let map;
    let renderableTiles;
    let centerTile;

    function handleKeyPress(event)
    {
        event.preventDefault();
        
        switch (event.keyCode) {
            case 37: //left
                centerTile = map.tiles[centerTile.x + 1][centerTile.y];
                break;
            case 38: //up
                centerTile = map.tiles[centerTile.x][centerTile.y + 1];
            break;
            case 39: //right
                centerTile = map.tiles[centerTile.x - 1][centerTile.y];
            break;
            case 40: //down
                 centerTile = map.tiles[centerTile.x][centerTile.y - 1];
            break;
            default:
                break;
        }

        console.log(centerTile);
        
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
        renderableTiles = new MapGenerator().create2DArray(40);
        
        centerTile = map.chooseRandomTile(terrain.LAND);

        window.addEventListener("keydown", handleKeyPress)
    }


    function update() {
        for (let x = 0; x < 40; x++) {
            for (let y = 0; y < 40; y++) {
                let xcoord = centerTile.x - (x - 20);
                let ycoord = centerTile.y - (y - 20);
                renderableTiles[x][y] = map.tiles[xcoord][ycoord];
            }
        }
        
    }
    
    function draw() {  
        for (let x = 0; x < renderableTiles.length; x++) {
            for (let y = 0; y < renderableTiles.length; y++) {
                let tile = renderableTiles[x][y];

                if (tile.type == terrain.WATER) {
                    
                    canvas.drawImage(WATER_TILE, x*64, y*64);
                }
                else if(tile.type == terrain.LAND)
                {
                    canvas.drawImage(GRASS_TILE, x*64, y*64);
                }
            }  
        }
        canvas.drawImage(PLAYER_TILE, 20*64, 20*64);
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