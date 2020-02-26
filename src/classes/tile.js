import DroppedItem from "./droppedItem.js";
import terrain from '../terrain.js';

export default class Tile {
    /**
     * 
     * @param {terrain} type The terrain type
     * @param {Number} x X-coord to create at
     * @param {Number} y Y-coord to create at
     */
    constructor(type, x, y, map) {
        this.map = map;
        this.type = type;
        this.x = x;
        this.y = y;
        this.currentHealth = type.health;
    }
    /**
     * 
     * @param {Number} radius 
     */
    bordering(radius) {
        let borderingTiles = [];

        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                if ((this.map[this.x+x]||[])[this.y+y] !== undefined) {
                    borderingTiles.push(this.map[this.x+x][this.y +y]);
                }
            }
        }
        borderingTiles.remove(this);
        
        return borderingTiles;
    }

    damage(amount, map) {        
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            if(this.type.drops[0]){
                let item = new DroppedItem(this.x, this.y, this.type.drops[0]);            
                map.droppedItems.push(item);
            }
            this.type = terrain.LAND;
            this.currentHealth = this.type.health;  
            return false;     
        } 
        return true;
    }
}