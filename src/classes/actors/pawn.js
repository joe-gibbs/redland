import Actor from "./actor.js";
import Spritesheet from "../spritesheet.js";
import Tile from "../tile.js";

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

        if (!this.destination) {
            return;
        }

        let xMovement = (this.destination.x - this.x) / 1000;
        let yMovement = (this.destination.y - this.y) / 1000;

        this.move(xMovement, yMovement);

        if (this.tile == this.destination) {
            this.destination = null;
        }
    }

    reconstructPath() {
          /*// End case -- result has been found, return the traced path
          if(currentNode.pos == end.pos) {
            var curr = currentNode;
            var ret = [];
            while(curr.parent) {
              ret.push(curr);
              curr = curr.parent;
            }
            return ret.reverse();
          }*/

    }

    aStar() { 
        /*var openList   = [];
        var closedList = [];
        openList.push(start);
     
        while(openList.length > ) {
     
          // Grab the lowest f(x) to process next
          var lowInd = ;
          for(var i=; i<openList.length; i++) {
            if(openList[i].f < openList[lowInd].f) { lowInd = i; }
          }
          var currentNode = openList[lowInd];
     
     
          // Normal case -- move currentNode from open to closed, process each of its neighbors
          openList.removeGraphNode(currentNode);
          closedList.push(currentNode);
          var neighbors = astar.neighbors(grid, currentNode);
     
          for(var i=; i<neighbors.length;i++) {
            var neighbor = neighbors[i];
            if(closedList.findGraphNode(neighbor) || neighbor.isWall()) {
              // not a valid node to process, skip to next neighbor
              continue;
            }
     
            // g score is the shortest distance from start to current node, we need to check if
            //   the path we have arrived at this neighbor is the shortest one we have seen yet
            var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
            var gScoreIsBest = false;
     
     
            if(!openList.findGraphNode(neighbor)) {
              // This the the first time we have arrived at this node, it must be the best
              // Also, we need to take the h (heuristic) score since we haven't done so yet
     
              gScoreIsBest = true;
              neighbor.h = astar.heuristic(neighbor.pos, end.pos);
              openList.push(neighbor);
            }
            else if(gScore < neighbor.g) {
              // We have already seen the node, but last time it had a worse g (distance from start)
              gScoreIsBest = true;
            }
     
            if(gScoreIsBest) {
              // Found an optimal (so far) path to this node.   Store info on how we got here and
              //  just how good it really is...
              neighbor.parent = currentNode;
              neighbor.g = gScore;
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
            }
          }
        }
     
        // No result was found -- empty array signifies failure to find path
        return [];    
    }

    heuristic(pos0, pos1) {
        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;*/
    }
}