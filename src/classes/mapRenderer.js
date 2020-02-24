import Terrain from '../terrain.js';
import Tile from './tile.js';
import GameMap from './gameMap.js';
import Player from './player.js';
import Building from './building.js';

const TREE_OFFSET = 15;
const ROCK_OFFSET = 16;
const PLAYER_OFFSET = 38;
const TREASURE_OFFSET = {x: 72, y: 112};


export default class MapRenderer {
    /**
     * 
     * @param {Number} tileSize 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {HTMLElement} gameCanvas 
     * @param {GameMap} map 
     * @param {Player} player 
     * @param {Building[]} buildings
     */
    constructor(tileSize, canvas, map, player, buildings) {
        this.tileSize = tileSize;
        this.canvas = canvas;
        this.player = player;
        this.map = map;
        this.buildings = buildings;
        this.renderFrame = 0;
        this.updateRenderableLength(canvas.canvas);
    }

    updateRenderableLength(gameCanvas) {
        this.canvasHeight = gameCanvas.height;
        this.canvasWidth = gameCanvas.width;

        this.tilesX = Math.ceil((this.canvasWidth) / this.tileSize);        
        this.tilesY = Math.ceil((this.canvasHeight) / this.tileSize);

        if (this.tilesX % 2 != 0) {
            this.tilesX++;
        }
        
        if (this.tilesY % 2 != 0) {
            this.tilesY++;
        }

        this.renderableTiles = [];               //
        for (let i = 0; i < this.tilesX + 4; i++) {  // Create 2 dimensional array
            this.renderableTiles[i] = [];        //
        }        
    }

    render(center, player) {
        function calculateX(x, tileSize) {
            return Math.ceil(x* tileSize) - ((center.x - player.x) * tileSize + tileSize);
        }

        function calculateY(y, tileSize) {
            return Math.ceil(y* tileSize) - ((center.y - player.y) * tileSize + tileSize);
        }

        this.fillRenderables(this.tilesX, this.tilesY, center, this.map);         

        for (let x = 0; x < (this.tilesX + 2); x++) {
            for (let y = 0; y < (this.tilesY + 2); y++) {
                if ((this.renderableTiles[x]||[])[y]) {
                    let currentTile = this.renderableTiles[x][y];
                    switch(currentTile.type){
                        case Terrain.FOREST:
                            if (currentTile.currentHealth < currentTile.type.health/2){
                                currentTile.type.tile.render(2, calculateX(x, this.tileSize), calculateY(y, this.tileSize) - TREE_OFFSET, this.canvas);
                            } else if (currentTile.currentHealth < currentTile.type.health){
                                currentTile.type.tile.render(1, calculateX(x, this.tileSize), calculateY(y, this.tileSize) - TREE_OFFSET, this.canvas);
                            } else {
                                currentTile.type.tile.render(0, calculateX(x, this.tileSize), calculateY(y, this.tileSize) - TREE_OFFSET, this.canvas);
                            }
                            break;
                        case Terrain.ROCK:
                            if (currentTile.currentHealth < currentTile.type.health/2){
                                currentTile.type.tile.render(2, calculateX(x, this.tileSize), calculateY(y, this.tileSize) - ROCK_OFFSET, this.canvas);
                            } else if(currentTile.currentHealth < currentTile.type.health){
                                currentTile.type.tile.render(1, calculateX(x, this.tileSize), calculateY(y, this.tileSize) - ROCK_OFFSET, this.canvas);
                            } else {
                                currentTile.type.tile.render(0, calculateX(x, this.tileSize), calculateY(y, this.tileSize) - ROCK_OFFSET, this.canvas);
                            }
                            break;
                        case Terrain.TREASURE:
                            if (currentTile.currentHealth < currentTile.type.health/2){
                                currentTile.type.tile.render(2, calculateX(x, this.tileSize), calculateY(y, this.tileSize), this.canvas);
                            } else if(currentTile.currentHealth < currentTile.type.health){
                                currentTile.type.tile.render(1, calculateX(x, this.tileSize), calculateY(y, this.tileSize), this.canvas);
                            } else {
                                currentTile.type.tile.render(0, calculateX(x, this.tileSize), calculateY(y, this.tileSize), this.canvas);
                            }
                            break;
                        default:
                            currentTile.type.tile.render(0, calculateX(x, this.tileSize), calculateY(y, this.tileSize), this.canvas);
                            break;
                    }       
                    this.drawBuildings(this.renderableTiles[x][y], calculateX(x, this.tileSize), calculateY(y, this.tileSize));
                    this.drawItems(this.renderableTiles[x][y], this.map, calculateX(x, this.tileSize), calculateY(y, this.tileSize));
                }
                else {
                    this.canvas.fillRect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
                }      
                getBorders(x, y, this.renderableTiles).forEach(tile => {                    
                    this.drawEdges(this.renderableTiles, tile, x, y, this.canvas);
                });
            }
        }
        
        //Render Player
        this.player.spritesheet.render(this.player.animationState().current, (this.tilesX/2)*this.tileSize, (this.tilesY/2)*this.tileSize - PLAYER_OFFSET, this.canvas);

        this.renderFrame++;

        if (this.renderFrame > 9) {
            this.renderFrame = 0;
            this.player.animationState().increment();            
        }
    }

    drawBuildings(tile, x, y) {
        this.buildings.forEach(element => {   
            if (tile.x === element.x && tile.y === element.y) {
                element.spritesheet.render(0, x - ((element.width * this.tileSize) - this.tileSize), y  - ((element.width * this.tileSize) - this.tileSize), this.canvas);
            }
        });
    }

    drawEdges(renderableTiles, tile, x, y, canvas) {
        // if (tile.type !== renderableTiles[x][y].type && tile.type.transitionIndex > renderableTiles[x][y].type.transitionIndex) {           
        //     let cx          = x*this.tileSize + 0.5 * this.tileSize;   // x of shape center
        //     let cy          = y*this.tileSize + 0.5 * this.tileSize;  // y of shape center
        //     let rotation  = calculateRotation(renderableTiles[x][y], tile);

        //     canvas.translate(cx, cy);              //translate to center of shape
        //     canvas.rotate( (Math.PI / 180) * rotation);  //rotate 90 degrees.
        //     canvas.translate(-cx, -cy);            //translate center back to 0,0
            
        //     canvas.drawImage(tile.type.transitionTile, x*this.tileSize, y*this.tileSize);
        //     canvas.resetTransform();
        // }
    }

    drawItems(tile, map, x, y) {            
        map.droppedItems.forEach(element => {
            if (tile === map.tiles[element.x][element.y]) { 
                //render treasure item with sprites.
                if (element.item.name === 'Treasure'){
                    element.item.spritesheet.render(element.item.animationState().current, x - TREASURE_OFFSET.x, y - TREASURE_OFFSET.y, this.canvas); 
                } else {
                    this.canvas.drawImage(element.item.image, x, y);
                }                     
            }
        });   
    }

    fillRenderables(width, height, center, map) {
        let tileOffset = 4; 
        for (let x = 0; x < width + tileOffset; x++) {
            for (let y = 0; y < height + tileOffset; y++) {
                let xcoord = center.x - (x - this.tilesX/2);
                let ycoord = center.y - (y - this.tilesY/2);
                if ((map.tiles[x+1]||[])[y] && ((map.tiles[xcoord + 1] || [])[ycoord + 1])) {
                    this.renderableTiles[x][y] = map.tiles[xcoord + 1][ycoord + 1];
                }
                else {
                    this.renderableTiles[x][y] = null;
                }
            }
        }
    }
}


/**
 * Finds the bordering tiles for any given tile.
 * 
 * @param {number} x The x-coordinate within renderable tiles to find the border for
 * @param {number} y The y-coordinate within renderable tiles to find the border for
 * @param {Tile[][]} tiles The list of tiles to search through
 */
function getBorders(x, y, tiles) {
    let result = [];

    if((tiles[x+1]||[])[y] !== undefined)
    {
        result.push(tiles[x+1][y]);  
    }
    if((tiles[x]||[])[y+1] !== undefined)
    {
        result.push(tiles[x][y+1]);
    }
    if((tiles[x-1]||[])[y] !== undefined)
    {
        result.push(tiles[x-1][y]);
    }
    if((tiles[x]||[])[y-1] !== undefined)
    {
        result.push(tiles[x][y-1]);  
    }        
    
    return result;            
}

/**
 * Used to find the degrees to rotate to get a tile to line up on the right edge as its neighbour.
 * @param {Tile} tile The first tile to calculate rotation between
 * @param {Tile} neighbour The second tile to calculate rotation between
 */
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