import Tile from './tile.js';
import DroppedItem from './droppedItem.js';

export default class GameMap {
    /**
     * 
     * @param {Tile[][]} tiles
     */
    constructor(tiles) {
        /** @type {Tile[][]} */
        this.tiles = tiles;
        /** @type {DroppedItem[]} */
        this.droppedItems = [];
    }

    setTile(x, y, terrainType) {
        this.tiles[x][y].type = terrainType;
    }

    chooseRandomTile(terrain)
    {
        let timeout = 50;

        function randomIndex(length) {
            return Math.floor(Math.random() * length);
          }

        let tile = this.tiles[randomIndex(this.tiles.length)][randomIndex(this.tiles.length)];        

         while (tile.type != terrain && timeout != 0) {
            timeout--;
            tile = this.tiles[randomIndex(this.tiles.length)][randomIndex(this.tiles.length)];            
        }

        if (timeout <= 0) {
            throw new Error('No tiles found, reloading map');
        }

        return tile;
    }
}