import Terrain from '../terrain.js';
import Tile from './tile.js';

const TREE_OFFSET = 15;
const PLAYER_OFFSET = 38;

export default class MapRenderer {
    constructor(tileSize, canvas, gameCanvas, map, player) {
        this.tileSize = tileSize;
        this.canvas = canvas;
        this.player = player;
        this.canvasHeight = gameCanvas.height;
        this.canvasWidth = gameCanvas.width;
        this.tilesX = Math.ceil((this.canvasWidth) / this.tileSize);        
        this.tilesY = Math.ceil((this.canvasHeight) / this.tileSize);
        this.map = map;
        
        if (this.tilesX % 2 != 0) {
            this.tilesX++;
        }
        
        if (this.tilesY % 2 != 0) {
            this.tilesY++;
        }

        this.renderableTiles = [];               //
        for (let i = 0; i < this.tilesX; i++) {  // Create 2 dimensional array
            this.renderableTiles[i] = [];        //
        }
    }

    render(center) {
        this.fillRenderables(this.tilesX, this.tilesY, center, this.map);         

        for (let x = 0; x < this.tilesX; x++) {
            for (let y = 0; y < this.tilesY; y++) {
                if ((this.renderableTiles[x]||[])[y]) {
                    switch(this.renderableTiles[x][y].type){
                        case Terrain.FOREST:
                            this.canvas.drawImage(this.renderableTiles[x][y].type.tile, x*this.tileSize, y*this.tileSize - TREE_OFFSET);
                            break;
                        default:
                            this.canvas.drawImage(this.renderableTiles[x][y].type.tile, x*this.tileSize, y*this.tileSize);
                            break;
                    }
                    // if(this.renderableTiles[x][y].type == Terrain.FOREST){
                    //     this.canvas.drawImage(this.renderableTiles[x][y].type.tile, x*this.tileSize, y*this.tileSize - 15);
                    // } else if( ) {

                    // } else {
                    //     this.canvas.drawImage(this.renderableTiles[x][y].type.tile, x*this.tileSize, y*this.tileSize);
                    // }
                    this.drawItems(this.renderableTiles[x][y], this.map, x, y);
                }
                else {
                    this.canvas.fillRect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
                }        
                getBorders(x, y, this.renderableTiles).forEach(tile => {                    
                    this.drawEdges(this.renderableTiles, tile, x, y, this.canvas);
                });
            }
        }
        //Draw Player
        this.canvas.drawImage(this.player.image, (this.tilesX/2)*this.tileSize, (this.tilesY/2)*this.tileSize - PLAYER_OFFSET);
    }

    drawEdges(renderableTiles, tile, x, y, canvas) {
        if (tile.type !== renderableTiles[x][y].type && tile.type.transitionIndex > renderableTiles[x][y].type.transitionIndex) {           
            let cx          = x*this.tileSize + 0.5 * this.tileSize;   // x of shape center
            let cy          = y*this.tileSize + 0.5 * this.tileSize;  // y of shape center
            let rotation  = calculateRotation(renderableTiles[x][y], tile);

            canvas.translate(cx, cy);              //translate to center of shape
            canvas.rotate( (Math.PI / 180) * rotation);  //rotate 90 degrees.
            canvas.translate(-cx, -cy);            //translate center back to 0,0
            
            canvas.drawImage(tile.type.transitionTile, x*this.tileSize, y*this.tileSize);
            canvas.resetTransform();
        }
    }

    drawItems(tile, map, x, y) {        
        map.droppedItems.forEach(element => {
            if (tile === map.tiles[element.x][element.y]) {                        
                this.canvas.drawImage(element.item.image, x*this.tileSize, y*this.tileSize);
            }
        });   
    }

    fillRenderables(width, height, center, map) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let xcoord = center.x - (x - this.tilesX/2);
                let ycoord = center.y - (y - this.tilesY/2);
                if ((map.tiles[x+1]||[])[y]) {
                    this.renderableTiles[x][y] = map.tiles[xcoord][ycoord];
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