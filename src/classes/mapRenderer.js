import Terrain from '../terrain.js';
import Tile from './tile.js';
import GameMap from './gameMap.js';
import Player from './actors/player.js';
import Pawn from './actors/pawn.js';

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
     * @param {Pawn[]} npcs
     */
    constructor(tileSize, canvas, map, player, npcs) {
        this.tileSize = tileSize;
        this.canvas = canvas;
        this.player = player;
        this.map = map;
        this.npcs = npcs;
        this.renderFrame = 0;

        /** @type {Tile[][]} */
        this.renderableTiles = [];

        this.updateRenderableLength(canvas.canvas);
        this.topLeft = {x: 0, y: 0};
        this.bottomRight = {x: 0, y: 0};
    }

    /**
     * Changes the number of items to be rendered based on the size of the canvas shown on screen.
     * @param {CanvasRenderingContext2D} gameCanvas 
     */
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

        function calculateSprite(currentTile) {
            let result = 0;
            switch(currentTile.type){
                case Terrain.FOREST:
                    if (currentTile.currentHealth < currentTile.type.health/2){
                        result = 2;
                    } else if (currentTile.currentHealth < currentTile.type.health){
                        result = 1;
                    } else {
                        result = 0;
                    }
                    break;
                case Terrain.ROCK:
                    if (currentTile.currentHealth < currentTile.type.health/2){
                        result = 2;
                    } else if(currentTile.currentHealth < currentTile.type.health){
                        result = 1;
                    } else {
                        result = 0;
                    }
                    break;
                case Terrain.TREASURE:
                    if (currentTile.currentHealth < currentTile.type.health/2){
                        result = 2;
                    } else if(currentTile.currentHealth < currentTile.type.health){
                        result = 1;
                    } else {
                        result = 0;
                    }
                    break;
                default:
                    result = 0;
                break;
            }
            return result;
        }

        this.fillRenderables(this.tilesX, this.tilesY, center, this.map);   

        for (let x = 0; x < (this.tilesX + 2); x++) {
            for (let y = 0; y < (this.tilesY + 2); y++) {
                if ((this.renderableTiles[x]||[])[y]) {
                    let currentTile = this.renderableTiles[x][y];
                  
                    currentTile.type.tile.render(calculateSprite(currentTile), calculateX(x, this.tileSize), calculateY(y, this.tileSize) - currentTile.type.offset, this.canvas);
                    
                    this.drawItems(this.renderableTiles[x][y], this.map, calculateX(x, this.tileSize), calculateY(y, this.tileSize));
                }
                else {
                    this.canvas.fillRect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }

        this.drawNpcs(center, player, this.tileSize);
        
        //Render Player
        this.player.spritesheet.render(this.player.animationState().current, (this.tilesX/2)*this.tileSize, (this.tilesY/2)*this.tileSize - PLAYER_OFFSET, this.canvas);

        this.renderFrame++;

        if (this.renderFrame > 9) {
            this.renderFrame = 0;
            this.player.animationState().increment();            
        }
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

    drawNpcs(center, player, tileSize) {        
        function calculate(coord, type) {            
            return Math.abs(coord * tileSize);                        
        }

        this.npcs.forEach(element => {
            //if (element.x <= this.topLeft.x && element.x >= this.bottomRight.x && element.y <= this.topLeft.y && element.y >= this.bottomRight.y) {
                //console.log('visible');      
                let x = calculate(element.x - this.bottomRight.x, 'x');
                let y = calculate(element.y - this.bottomRight.y, 'y');
                let tile = {x: element.tile.x, y: element.tile.y};
                    
                element.spritesheet.render(0, x, y, this.canvas);
            //}
        });
    }
    

    /**
     * Fills up the array of renderables so that the whole map isn't shown
     * 
     * @param {Number} width The width to fill the array
     * @param {Number} height The height to fill the array
     * @param {Tile} center The center tile
     * @param {GameMap} map Game map to fill from
     */
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

        this.topLeft = {x: this.renderableTiles[0][0].x, y: this.renderableTiles[0][0].y};                
        this.bottomRight = {x: this.renderableTiles[this.renderableTiles.length - 1][this.renderableTiles[0].length - 1].x, y: this.renderableTiles[this.renderableTiles.length - 1][this.renderableTiles[0].length - 1].y};
    }
}