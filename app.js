const canvas = document.querySelector('#game').getContext("2d");
let CANVAS_WIDTH = window.innerWidth;
let CANVAS_HEIGHT = window.innerHeight;
const WATER_RATIO = 0.3;

const terrain = {
    "LAND": {
        name: 'Land',
        walkable: true,
        tile: new Image(),
    },
    "WATER": {
        name: 'Water',
        walkable: false,
        tile: new Image(),
    },
    "FOREST": {
        name: 'Forest',
        walkable: false,
        tile: new Image(),
    },
    "SAND": {
        name: 'Sand',
        walkable: true,
        tile: new Image(),
    },
    "ROCK": {
        name: 'Rock',
        walkable: false,
        tile: new Image(),
    }
}
terrain.LAND.tile.src = './assets/img/grass.png';
terrain.WATER.tile.src = './assets/img/water.png';
terrain.FOREST.tile.src = './assets/img/forest.png';
terrain.SAND.tile.src = './assets/img/sand.png';
terrain.ROCK.tile.src = './assets/img/rock.png';
Object.freeze(terrain); //Turns into an enum

const tools = {
    "AXE": {

    },
    "SHOVEL": {

    },
    "BOAT": {

    },
}
Object.freeze(tools);

class Item {
    constructor(image, name) {
        this.image = new Image();
        this.image.src = image;
        this.name = name;
    }
}

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
    bordering(map, radius) {
        let borderingTiles = [];

        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                if ((map[this.x+x]||[])[this.y+y] !== undefined) {
                    borderingTiles.push(map[this.x+x][this.y+y]);
                }
            }
        }
        borderingTiles.remove(this);
        
        return borderingTiles;
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
        this.tools = [tools.AXE];
        this.health = 100;
        this.direction = [0,1];
    }

    pickup(item) {
        if (this.tools.includes(item)) {
            return;
        }
        else if (this.tools.length > 1) {
            this.tools.shift();
        }
        this.tools.push(item);
        return item;
    }

    move(x,y, map) {   
             
        if (map.tiles[this.x + x][this.y + y].type.walkable) {
            this.x += x;
            this.y += y;
        }
        
        console.log((map.tiles[this.x][this.y]).bordering(map.tiles, 1).filter(e => e.type === terrain.WATER).length > 0);
        
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
    
      
      generate(size, simplex) {
        let data = this.create2DArray(size);

        function setTile(tile, x, y) {
            let val = (((simplex.noise2D(x / 500, y / 500)) - .7) + (((simplex.noise2D(x / 80, y / 80)) / 1.5) + ((Math.abs(simplex.noise2D(x / 20, y / 20) / 5))))) * 100;
            tile = val < 0 ? new Tile(terrain.WATER, x, y) : new Tile(terrain.LAND, x ,y);

            let forestVal = normalise(simplex.noise2D(x / 12, y / 12), 0, 1);
            if (forestVal < 0.9) {
                if (tile.type === terrain.LAND) {
                    tile.type = terrain.FOREST;
                }
            }
        
            return tile;
        }

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let tile = data[x][y];
                data[x][y] = setTile(tile, x, y);
            }
        }   

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {

                let tile = data[i][j];
                if (tile.type === terrain.LAND &&  //Checks if there are any water tiles in a 1 tile radius, if so set to sand
                    (tile.bordering(data, 1)
                        .filter(e => e.type === terrain.WATER).length > 0))
                {
                    tile.type = terrain.SAND;
                }

                let rockVal = normalise(simplex.noise2D(i / 50, j / 50), 0, 1);
                if (rockVal < 0.95 && tile.bordering(data, 5).filter(e => e.type === terrain.WATER).length === 0) {
                    if (tile.type !== terrain.WATER) {
                        tile.type = terrain.ROCK;
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
    let gameCanvas;

    function handleKeyPress(event)
    {
        //event.preventDefault();
        
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
        gameCanvas = document.querySelector('#game');
        
        gameCanvas.width = CANVAS_WIDTH;
        gameCanvas.height = CANVAS_HEIGHT;
    
        //Add colour to canvas
        canvas.fillColor = 'black';
        canvas.font = "32px Arial";
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
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

        let iter = 0;
        for (var key in player.resources) {
            iter++;
            canvas.fillText(key + ' ' + player.resources[key], uiX, uiY + (32 * iter) );
        }
    }
    
    function draw() { 
        let tilesX = Math.ceil((CANVAS_WIDTH) / 64);
        let tilesY = Math.ceil((CANVAS_HEIGHT) / 64);
        
        if (tilesX % 2 != 0) {
            tilesX++;
        }
        
        if (tilesY % 2 != 0) {
            tilesY++;
        }

        let renderableTiles = [];           //
        for (let i = 0; i < tilesX; i++) {  // Create 2 dimensional array
            renderableTiles[i] = [];        //
        }

        //Add tiles to renderableTiles
        for (let x = 0; x < tilesX; x++) {
            for (let y = 0; y < tilesY; y++) {
                let xcoord = centerTile.x - (x - tilesX/2);
                let ycoord = centerTile.y - (y - tilesY/2);
                renderableTiles[x][y] = map.tiles[xcoord][ycoord];
            }
        }

        for (let x = 0; x < tilesX; x++) {
            for (let y = 0; y < tilesY; y++) {
                canvas.drawImage(renderableTiles[x][y].type.tile, x*64, y*64);                
            }
        }
        canvas.drawImage(player.image, (tilesX/2)*64, (tilesY/2)*64);
        drawUi();
        window.requestAnimationFrame(loop);
    }

    function loop() {
        update();
        draw();
    }

    setup();
     
    window.requestAnimationFrame(loop);
};


/* TEXTING
 https://github.com/josephg/noisejs

 
*/