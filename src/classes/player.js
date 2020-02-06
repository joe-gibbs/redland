import DroppedItem from './droppedItem.js';
import terrain from '../terrain.js';
import items from '../items.js';
import Spritesheet from './spritesheet.js';

export default class Player {
    constructor(x, y) {
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
        this.resources = {
            wood: 0,
            food: 10,
            stone: 0,
        };
        this.showCraftingMenu = false;
        this.equipped;
        this.items = [];
        this.health = 100;
        this.direction = [0,1]; // DIRECTIONS -> [Right <= 0 < Left, back <= 0 < front]
        this.movement = [0,0];
        this.closestX = x;
        this.closestY = y;
        this.aimedTile; //Tile that the player is looking at based on direction.
    }

    animationState() {                
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

    updateAimedTile(map){
        this.aimedTile = map.tiles[Math.round(this.x + this.direction[0])][Math.round(this.y + this.direction[1])];
    }

    updateMovement(map) { 
        let x = this.movement[0];
        let y = this.movement[1];

        if (map.tiles[Math.round(this.x + x)][Math.round(this.y + y)].type.walkable) {
            this.x += x;
            this.y += y;
        }
        else if (map.tiles[Math.round(this.x + x)][Math.round(this.y)].type.walkable) {
            this.x += x;
        }
        else if (map.tiles[Math.round(this.x)][Math.round(this.y + y)].type.walkable) {
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
                            this.equipped = actualItem.name;
                            this.items.push(actualItem);
                            break;
                    }
                    droppedItems.remove(item);
                }
            }
        });
    }

    drop(droppedItems, item) {
        droppedItems.push(new DroppedItem(this.closestX, this.closestY, item));
        this.items.remove(item);
        this.equipped = "";
    }

    chop(map) {
        let working = false;
        if(this.equipped === "Axe"){
            if(this.aimedTile.type.name === "Forest"){
                working = this.aimedTile.damage(1.5, map);
            }
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