const canvas = document.querySelector('#game').getContext("2d");
let CANVAS_WIDTH = window.innerWidth;
let CANVAS_HEIGHT = window.innerHeight;
let TILE_SIZE = window.innerWidth / 23;
const WATER_RATIO = 0.3;

class Terrain {
    constructor(name, walkable, image) {
        this.tile = new Image();
        this.tile.src = image;
        this.name = name;
        this.walkable = walkable;
    }
}

class Item {
    constructor(name, image) {
        this.image = new Image();
        this.image.src = image;
        this.name = name;
    }
}

const items = {
    "AXE": new Item('Axe', './assets/img/axe.png'),
}

const terrain = {
    "LAND": new Terrain('Land', true, './assets/img/grass.png'),
    "WATER": new Terrain('Water', false, './assets/img/water.png'),
    "FOREST": new Terrain('Forest', false, './assets/img/forest.png'),
    "SAND": new Terrain('Sand', true, './assets/img/sand.png'),
    "ROCK": new Terrain('Rock', false, './assets/img/rock.png'),
}

Object.freeze(items);
Object.freeze(terrain); //Turns into an enum

class DroppedItem {
    constructor(x, y, item) {
        this.x = x;
        this.y = y;
        this.item = item;
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
        this.items = [];
        this.health = 100;
        this.direction = [0,1];
    }

    pickup(droppedItems) {
        droppedItems.forEach(item => {
            console.log(item, this);
            
            if (item.x === this.x && item.y === this.y) {
                let actualItem = item.item;
                if (!this.items.includes(actualItem)) {
                    this.items.push(actualItem);
                    droppedItems.remove(item);
                }
            }
        });
    }

    drop(droppedItems, item) {
        droppedItems.push(new DroppedItem(this.x, this.y, item));
        this.items.remove(item);
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
    let droppedItems = [];

    function handleKeyPress(event)
    {
        //event.preventDefault();
        
        switch (event.code) {
            case 'ArrowLeft': //left
                centerTile = player.move(1, 0, map)
                break;
            case 'ArrowUp': //up
                centerTile = player.move(0, 1, map)
                break;
            case 'ArrowRight': //right
                centerTile = player.move(-1, 0, map)
                break;
            case 'ArrowDown': //down
                centerTile = player.move(0, -1, map)
                break;
            case 'KeyE':
                player.pickup(droppedItems);
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
        canvas.font = CANVAS_WIDTH/12 + "px Arial";
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        map = new GameMap(new MapGenerator().generate(1024, new SimplexNoise()));
        
        centerTile = map.chooseRandomTile(terrain.LAND);

        droppedItems.push(new DroppedItem(centerTile.x + 1, centerTile.y + 1, items.AXE));

        player = new Player(centerTile.x, centerTile.y);

        window.addEventListener("keydown", handleKeyPress);
    }


    function update() {
        CANVAS_WIDTH = window.innerWidth;
        CANVAS_HEIGHT = window.innerHeight;
        gameCanvas.width = CANVAS_WIDTH;
        gameCanvas.height = CANVAS_HEIGHT;
        TILE_SIZE = window.innerWidth / 23;
    }

    function drawUi() {
        let resourceIcon = new Image();
        resourceIcon.src = './assets/img/resource.png';

        let uiX = Math.ceil(CANVAS_WIDTH/1.5 / TILE_SIZE) * TILE_SIZE;
        let uiY = Math.ceil(CANVAS_HEIGHT/80 / TILE_SIZE) * TILE_SIZE;

        canvas.drawImage(resourceIcon, uiX, uiY);

        let iter = 0;
        for (var key in player.resources) {
            iter++;
            canvas.fillText(key + ' ' + player.resources[key], uiX, uiY + (32 * iter) );
        }
    }
    
    function draw() { 
        let tilesX = Math.ceil((CANVAS_WIDTH) / TILE_SIZE);
        let tilesY = Math.ceil((CANVAS_HEIGHT) / TILE_SIZE);
        
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
                canvas.drawImage(renderableTiles[x][y].type.tile, x*TILE_SIZE, y*TILE_SIZE);
                droppedItems.forEach(element => {
                    if (renderableTiles[x][y] === map.tiles[element.x][element.y]) {                        
                        canvas.drawImage(element.item.image, x*TILE_SIZE, y*TILE_SIZE);
                    }
                }); 
            }
        }
        canvas.drawImage(player.image, (tilesX/2)*TILE_SIZE, (tilesY/2)*TILE_SIZE);
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