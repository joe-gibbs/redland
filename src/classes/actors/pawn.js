import Actor from "./actor.js";
import Spritesheet from "../spritesheet.js";
import Tile from "../tile.js";
import Queue from "../../queue.js";
/**
 * Pawn is the base class for all AI-controlled characters
 */
export default class Pawn extends Actor {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Spritesheet} spritesheet 
     * @param {Number} maxHealth 
     * @param {Number} speed 
     * @param {Boolean} aggressive 
     */
    constructor(map, x, y, spritesheet, maxHealth, speed, aggressive) {
        super(map, x, y, spritesheet, maxHealth, speed);
        this.aggressive = aggressive;
        this.destination = null;
        this.goalPath = [];
    }

    /**
     * 
     * @param {Tile} tile 
     */
    moveTo(tile) {        
        if (!tile.type.walkable) {
            return;
        }

        this.destination = tile;
    }

    updateMovement() {
        super.updateMovement();

        if (this.goalPath.length > 0 && !this.destination) {
            this.destination = this.goalPath.pop();
        }

        if (!this.destination) {
            return;
        }

        let xMovement = (this.destination.x - this.x) / 20;
        let yMovement = (this.destination.y - this.y) / 20;

        this.move(xMovement, yMovement);        

        if (this.tile == this.destination) {
            this.destination = null;
            this.movement = [0,0];
        }
    }

    /**
     * 
     * @param {Tile} start 
     * @param {Tile} end 
     * @returns {Tile[]}
     */
    search(end) { 
        let start = this.tile;
        let openList   = new Queue()
        let closedList = [start];
        
        function reconstructPath(c) {
            let timeout = 50;
            let current = c;
            let path = [];
            while (current.parent != null) { 
                timeout--;
                path.push(current);
                current = current.parent;
                if (timeout === 0) {
                    return [];
                }
            }

            closedList.forEach(element => {
                element.parent = null;
            });

            return path.reverse();
        }

        openList.enqueue(start);        
     
        while(openList.getLength() > 0) {            
            let current = openList.dequeue();
            
            if (current == end) {
                this.goalPath = reconstructPath(current);
            }

            current.bordering(1).filter(e => e.type.walkable).forEach(bordering => {                    
                if (!closedList.includes(bordering)) {
                    closedList.push(bordering);
                    bordering.parent = current;
                    openList.enqueue(bordering);
                }
            });
        }
     
        // No result was found -- empty array signifies failure to find path
        return []; 
    }
}
