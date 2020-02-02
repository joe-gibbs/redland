import DroppedItem from "./droppedItem.js";
import terrain from '../terrain.js';

export default class Tile {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.currentHealth = type.health;
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

    damage(amount, map) {        
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            let item = new DroppedItem(this.x, this.y, this.type.drops[0]);            
            map.droppedItems.push(item);
            this.type = terrain.LAND;
            this.currentHealth = this.type.health;  
            return false;     
        } 
        return true;
    }
}