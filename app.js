const canvas = document.querySelector('#game').getContext("2d");
let CANVAS_WIDTH = window.innerWidth;
let CANVAS_HEIGHT = window.innerHeight;
let TILE_SIZE = window.innerWidth / 23;
const WATER_RATIO = 0.3;

class Terrain {
    constructor(name, walkable, image, transitionIndex, transitionImage) {
        this.tile = new Image();
        this.tile.src = image;
        this.name = name;
        this.walkable = walkable;
        this.transitionIndex = transitionIndex,
        this.transitionTile = new Image();
        this.transitionTile.src = transitionImage;
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
    "LAND": new Terrain('Land', true, './assets/img/grass.png', 1, './assets/img/c_grass.png'),
    "SAND": new Terrain('Sand', true, './assets/img/sand.png', 0, './assets/img/c_grass.png'),
    "WATER": new Terrain('Water', false, './assets/img/water.png', 2, './assets/img/c_water.png'),
    "ROCK": new Terrain('Rock', false, './assets/img/rock.png', 3, './assets/img/c_rock.png'),
    "FOREST": new Terrain('Forest', false, './assets/img/forest.png', 4, './assets/img/c_forest.png'),
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
    bordering(xcoord, ycoord, map, radius) {
        let borderingTiles = [];

        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                if ((map[xcoord+x]||[])[ycoord+y] !== undefined) {
                    borderingTiles.push(map[xcoord+x][ycoord+y]);
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

    chop(map) {
         map[this.x + this.direction[0]][this.y + this.direction[1]].type = terrain.LAND;
    }

    move(x,y, map) {   
        this.direction = [x, y];
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
                    (tile.bordering(tile.x, tile.y, data, 1)
                        .filter(e => e.type === terrain.WATER).length > 0))
                {
                    tile.type = terrain.SAND;
                }

                let rockVal = normalise(simplex.noise2D(i / 50, j / 50), 0, 1);
                if (rockVal < 0.95 && tile.bordering(tile.x, tile.y, data, 5).filter(e => e.type === terrain.WATER).length === 0) {
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
    let clouds;

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
            case 'Enter':
                player.chop(map.tiles);
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

        clouds = new Image();
        clouds.src = './assets/img/clouds.png';

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

                function getBorders(x,y) {
                    let result = [];
                    if((renderableTiles[x+1]||[])[y] !== undefined)
                    {
                        result.push(renderableTiles[x+1][y]);  
                    }
                    if((renderableTiles[x]||[])[y+1] !== undefined)
                    {
                        result.push(renderableTiles[x][y+1]);
                    }
                    if((renderableTiles[x-1]||[])[y] !== undefined)
                    {
                        result.push(renderableTiles[x-1][y]);
                    }
                    if((renderableTiles[x]||[])[y-1] !== undefined)
                    {
                        result.push(renderableTiles[x][y-1]);  
                    }        
                    
                    return result;            
                }

                function calculateRotation(tile, neighbour) {
                    if (tile.x + 1 === neighbour.x) {
                        return 270;
                    }
                    if (tile.x - 1 === neighbour.x) {
                        return 90;
                    }
                    if (tile.y === neighbour.y + 1) {
                        return 180;
                    }
                    if (tile.y === neighbour.y - 1) {
                        return 0;
                    }
                }
            
                canvas.drawImage(renderableTiles[x][y].type.tile, x*TILE_SIZE, y*TILE_SIZE);
                
                getBorders(x, y).forEach(tile => {                    
                    if (tile.type !== renderableTiles[x][y].type && tile.type.transitionIndex > renderableTiles[x][y].type.transitionIndex) {           
                        let cx          = x*TILE_SIZE + 0.5 * TILE_SIZE;   // x of shape center
                        let cy          = y*TILE_SIZE + 0.5 * TILE_SIZE;  // y of shape center
                        let rotation  = calculateRotation(renderableTiles[x][y], tile);

                        canvas.translate(cx, cy);              //translate to center of shape
                        canvas.rotate( (Math.PI / 180) * rotation);  //rotate 90 degrees.
                        canvas.translate(-cx, -cy);            //translate center back to 0,0
                        
                        canvas.drawImage(tile.type.transitionTile, x*TILE_SIZE, y*TILE_SIZE);
                        canvas.resetTransform();
                    }
                });
                droppedItems.forEach(element => {
                    if (renderableTiles[x][y] === map.tiles[element.x][element.y]) {                        
                        canvas.drawImage(element.item.image, x*TILE_SIZE, y*TILE_SIZE);
                    }
                });

            }
        }
        canvas.drawImage(player.image, (tilesX/2)*TILE_SIZE, (tilesY/2)*TILE_SIZE);

        //canvas.drawImage(clouds, 0, 0, CANVAS_WIDTH, CANVAS_WIDTH);

        drawUi();
        window.requestAnimationFrame(loop);
    }

    const fps = {
        sampleSize : 60,    
        value : 0,
        _sample_ : [],
        _index_ : 0,
        _lastTick_: false,
        tick : function(){
            // if is first tick, just set tick timestamp and return
            if( !this._lastTick_ ){
                this._lastTick_ = performance.now();
                return 0;
            }
            // calculate necessary values to obtain current tick FPS
            let now = performance.now();
            let delta = (now - this._lastTick_)/1000;
            let fps = 1/delta;
            // add to fps samples, current tick fps value 
            this._sample_[ this._index_ ] = Math.round(fps);
            
            // iterate samples to obtain the average
            let average = 0;
            for(let i=0; i<this._sample_.length; i++) average += this._sample_[ i ];
    
            average = Math.round( average / this._sample_.length);
    
            // set new FPS
            this.value = average;
            // store current timestamp
            this._lastTick_ = now;
            // increase sample index counter, and reset it
            // to 0 if exceded maximum sampleSize limit
            this._index_++;
            if( this._index_ === this.sampleSize) this._index_ = 0;
            return this.value;
        }
    }    

    function loop() {
        let fpsValue = fps.tick();
        window.fps.innerHTML = fpsValue;
        update();
        draw();
    }

    setup();
     
    window.requestAnimationFrame(loop);
};