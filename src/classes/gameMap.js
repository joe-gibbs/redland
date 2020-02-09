import Tile from './tile.js';

export default class GameMap {
    /**
     * 
     * @param {Tile[]} tiles
     */
    constructor(tiles) {
        this.tiles = tiles;
        this.droppedItems = [];
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