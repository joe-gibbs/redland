export default class Tile {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }
    /**
     * 
     * @param {Number} xcoord 
     * @param {Number} ycoord 
     * @param {Tile[]} map 
     * @param {Number} radius 
     */
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