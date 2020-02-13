import DroppedItem from './droppedItem.js';
import terrain from '../terrain.js';
import items from '../items.js';
import Item from './item.js';
import Spritesheet from './spritesheet.js';
import GameMap from './gameMap.js';

export default class Player {
    constructor(x, y, treasureLocation) {
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.spritesheet = new Spritesheet('./assets/img/player.png', 64, 80);
        this.spritesheet.addAnimationSet('idleForward', 0, 0);
        this.spritesheet.addAnimationSet('idleBack', 1, 1);
        this.spritesheet.addAnimationSet('idleLeft', 2, 2);
        this.spritesheet.addAnimationSet('idleRight', 3, 3);
        this.spritesheet.addAnimationSet('walkBack', 4, 8);
        this.spritesheet.addAnimationSet('walkForward', 8, 12);
        this.spritesheet.addAnimationSet('walkLeft', 12, 16);
        this.spritesheet.addAnimationSet('walkRight', 16, 20);
        this.spritesheet.addAnimationSet('sail', 20, 20);
        this.resources = {
            wood: 0,
            stone: 0,
        };
        this.onSea = false;
        this.showCraftingMenu = false;
        this.showMap = false;
        this.items = [];
        this.health = 100;
        this.direction = [0,1]; // DIRECTIONS -> [Right <= 0 < Left, back <= 0 < front]
        this.movement = [0,0];
        this.closestX = x;
        this.closestY = y;
        this.aimedTile; //Tile that the player is looking at based on direction.
        this.treasureLocation = treasureLocation;
    }

    /**
     * @type {Item}
     */
    get equipped() {
        return this.items[0];
    }

    set equipped(equipped) {
        this.items.push(equipped);
        if (this.items.length > 2) {
            this.drop(this.items.last());
        }
    }

    switchItems() {
        this.items.reverse();
    }

    animationState() {     
        if (this.onSea) {
            return this.spritesheet.animationSets['sail'];
        }   
        else {      
            if (this.movement[0] !== 0 || this.movement[1] !== 0) {
                if (this.direction[0] == 0 && this.direction[1] <= 0) {
                    return this.spritesheet.animationSets['walkForward'];
                }
                else if (this.direction[0] == 0 && this.direction[1] > 0) {
                    return this.spritesheet.animationSets['walkBack'];
                } 
                else if (this.direction[0] <= 0 && this.direction[1] == 0) {
                    return this.spritesheet.animationSets['walkRight'];
                } 
                else if (this.direction[0] > 0 && this.direction[1] == 0) {
                    return this.spritesheet.animationSets['walkLeft'];
                }
            }
            else {
                if (this.direction[0] <= 0 && this.direction[1] == 0) {
                    return this.spritesheet.animationSets['idleRight'];
                } 
                else if (this.direction[0] > 0 && this.direction[1] == 0) {
                    return this.spritesheet.animationSets['idleLeft'];
                }
                else if (this.direction[0] == 0 && this.direction[1] <= 0) {
                    return this.spritesheet.animationSets['idleForward'];
                }
                else if (this.direction[0] == 0 && this.direction[1] > 0) {
                    return this.spritesheet.animationSets['idleBack'];
                } 
            }   
        }
        return this.spritesheet.animationSets['idleForward'];
    }

    updateAimedTile(map){
        this.aimedTile = map.tiles[Math.round(this.x + this.direction[0])][Math.round(this.y + this.direction[1])];
    }

    /**
     * 
     * @param {GameMap} map 
     */
    updateMovement(map) { 
        let x = this.movement[0];
        let y = this.movement[1];

        let tileXYmovement = map.tiles[Math.round(this.x + x)][Math.round(this.y + y)].type;
        let tileXmovement = map.tiles[Math.round(this.x + x)][Math.round(this.y)].type;
        let tileYmovement = map.tiles[Math.round(this.x)][Math.round(this.y + y)].type;

        if (this.equipped === items.boat && (tileXYmovement.sailable || tileXmovement.sailable || tileYmovement.sailable)) {
            this.onSea = true;
        }
        else {
            this.onSea = false;
        }

        if (tileXYmovement.walkable || (this.equipped === items.boat && tileXYmovement.sailable)) {
            this.x += x;
            this.y += y;
        }
        else if (tileXmovement.walkable || (this.equipped === items.boat && tileXmovement.sailable)) {
            this.x += x;
        }
        else if (tileYmovement.walkable || (this.equipped === items.boat && tileYmovement.sailable)) {
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

        this.closestX = Math.round(this.x);
        this.closestY = Math.round(this.y);    

        this.updateAimedTile(map)

        this.movement = [x, y];
    }

    pickup(droppedItems) {
        let equipped2 = false;
        droppedItems.forEach(item => {    
            if (item.x === this.closestX && item.y === this.closestY) {
                let actualItem = item.item;
                if (!this.items.includes(actualItem)) {
                    switch (actualItem) {
                        case items.wood:
                            this.resources.wood += 10;
                            break;
                        case items.food:
                            this.resources.food += 10;
                            break;
                        case items.gold:
                            this.resources.gold += 10;
                            break;
                        case items.stone:
                            this.resources.stone += 10;
                            break;
                        default:
                            if (this.items.length < 2){
                                this.equipped = actualItem;
                            } else {
                                equipped2 = true;
                            }
                            break;
                    }
                    if(!equipped2){
                        droppedItems.remove(item);
                    }
                    return true;
                }
            }
        }); 
    }

    dropEquipped(droppedItems) {
        if (this.equipped) {
            this.drop(droppedItems, this.equipped);
        }
    }

    drop(droppedItems, item) {        
        droppedItems.push(new DroppedItem(this.closestX, this.closestY, item));
        this.items.remove(item);

        //close map if you drop it.
        if(item.name === items.map.name){
            console.log('map item');
            this.showMap = false;
        }

    }

    chop(map) {
        let working = false;
        if(this.equipped === items.axe){
            if(this.aimedTile.type === terrain.FOREST){
                working = this.aimedTile.damage(1.5, map);
            }
        }
        if (this.equipped === items.pick) {
            if(this.aimedTile.type === terrain.ROCK){
                working = this.aimedTile.damage(2.5, map);
            }
        }
        if (this.equipped === items.shovel){
            if(/*this.aimedTile.type === terrain.LAND ||*/ this.aimedTile.type === terrain.TREASURE){
                //locates there will only be damage on the floor in the treasure location. 
                if(this.aimedTile.x === this.treasureLocation.x && this.aimedTile.y === this.treasureLocation.y){
                    working = this.aimedTile.damage(1.5, map);
                }
            }
        }
        if (this.equipped === items.map){
            this.showMap = !this.showMap
        }
        return working;
    }

    move(x,y, map) { 
        this.direction = [x, y];
                     
        this.movement[0] += x;
        this.movement[1] += y;

        this.movement[0] = this.movement[0].clamp(-0.12, 0.12);
        this.movement[1] = this.movement[1].clamp(-0.12, 0.12);

        return map.tiles[this.closestX][this.closestY];
    }
}