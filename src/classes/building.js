import Spritesheet from "./spritesheet.js";
import GameMap from "./gameMap.js";
import terrain from "../terrain.js";

export default class Building {
    /**
     * 
     * @param {*} options 
     * @param {GameMap} gameMap 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(options, gameMap, x, y) {
        console.log(options);
        
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

        for (let i = x; i < x + this.width; i++) {
            for (let j = y; j < y + this.height; j++) {
                gameMap.tiles[i][j].type = terrain.BUILDING;
                gameMap.tiles[i][j].currentHealth = Infinity;
                gameMap.tiles[i][j].building = this;
            }            
        }
    }
}