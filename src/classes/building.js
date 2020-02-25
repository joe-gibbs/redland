import Spritesheet from "./spritesheet.js";
import GameMap from "./gameMap.js";
import terrain from "../terrain.js";
import DroppedItem from "./droppedItem.js";

export default class Building {
    /**
     * 
     * @param {*} options 
     * @param {GameMap} gameMap 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(options, gameMap, x, y) {        
        this.name = options.name;
        this.x = x;
        this.y = y;
        this.width = options.width;
        this.height = options.height;
        /**
         * @type {Spritesheet}
         */
        this.spritesheet = options.spritesheet;
        this.requires = options.requires;
        this.drops = options.drops;
        this.maxHealth = options.maxHealth;
        this.health = options.maxHealth;
        this.gameMap = gameMap;

        for (let i = x; i < x + this.width; i++) {
            for (let j = y; j < y + this.height; j++) {
                gameMap.tiles[i][j].type = terrain.BUILDING;
                gameMap.tiles[i][j].currentHealth = Infinity;
                gameMap.tiles[i][j].building = this;
            }            
        }
    }

    damage(amount) {
        this.health -= amount;
    }

    /**
     * 
     * @param {Building[]} buildings 
     * @param {DroppedItem[]} droppedItems
     */
    checkHealth(buildings, droppedItems) {
        if (this.health <= 0) {
            buildings.remove(this);
            this.requires.forEach(requirement => {
                for (let x = 0; x < requirement[1]; x += 10) {
                    droppedItems.push(new DroppedItem(this.x, this.y, requirement[0]));
                }
            });
            this.destroy();
        }
    }

    destroy() {
        for (let i = this.x; i < this.x + this.width; i++) {
            for (let j = this.y; j < this.y + this.height; j++) {
                this.gameMap.tiles[i][j].type = terrain.RUBBLE;
                this.gameMap.tiles[i][j].currentHealth = terrain.RUBBLE.health;
                this.gameMap.tiles[i][j].building = null;
            }            
        }
    }
}