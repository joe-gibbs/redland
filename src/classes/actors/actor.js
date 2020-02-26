import Spritesheet from "../spritesheet.js";
import GameMap from "../gameMap.js";

/**
 * Actors are the base class for players and AI
*/

export default class Actor {
    /**
     * @param {GameMap} map
     * @param {Number} x 
     * @param {Number} y 
     * @param {Spritesheet} spritesheet 
     * @param {Number} maxHealth 
     * @param {Number} speed 
     */
    constructor(map, x, y, spritesheet, maxHealth, speed) {
        this.x = x;
        this.y = y;
        this.spritesheet = spritesheet;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.speed = speed;
        this.direction = [0,1]; // DIRECTIONS -> [Right <= 0 < Left, back <= 0 < front]
        this.movement = [0,0];
        this.tile = map.tiles[x, y]
        this.aimedTile; //Tile that the actor is looking at based on direction.
        this.map = map;
    }

    updateAimedTile(){        
        this.aimedTile = this.map.tiles[Math.round(this.x + this.direction[0])][Math.round(this.y + this.direction[1])];
    }

    move(x,y) {
        if (Math.abs(x) > Math.abs(y)) {
            this.direction = [x, 0];
        }
        else {
            this.direction = [0, y];
        }

        this.movement[0] += x;
        this.movement[1] += y;

        this.movement[0] = this.movement[0].clamp(-0.12, 0.12);
        this.movement[1] = this.movement[1].clamp(-0.12, 0.12);

        return this.tile;
    }

    checkIfWalkable(tile) {
        return tile.walkable;
    }

    updateMovement() { 
        let x = this.movement[0];
        let y = this.movement[1];

        let tileXYmovement = this.map.tiles[Math.round(this.x + x)][Math.round(this.y + y)].type;
        let tileXmovement = this.map.tiles[Math.round(this.x + x)][Math.round(this.y)].type;
        let tileYmovement = this.map.tiles[Math.round(this.x)][Math.round(this.y + y)].type;

        if (this.checkIfWalkable(tileXYmovement)) {
            this.x += x;
            this.y += y;
        }
        else if (this.checkIfWalkable(tileXmovement)) {
            this.x += x;
        }
        else if (this.checkIfWalkable(tileYmovement)) {
            this.y += y;
        }

        x = x * 0.8;
        y = y * 0.8;

        if (x < 0.03 && x > -0.03) {
            x = 0;
        }

        if (y < 0.03 && y > -0.03) {
            y = 0;
        }

        this.tile = this.map.tiles[Math.round(this.x)][Math.round(this.y)];

        this.updateAimedTile()

        this.movement = [x, y];
    }
}