import DroppedItem from './droppedItem.js';
import terrain from '../terrain.js';
import items from '../items.js';

export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.image = new Image();
        this.image.src = './assets/img/player.png';
        this.resources = {
            wood: 0,
            food: 10,
            stone: 0,
        };
        this.equipped;
        this.items = [];
        this.health = 100;
        this.direction = [0,1];
        this.movementAxis = [0,0];
        this.closestX = x;
        this.closestY = y;
        this.aimedTile; //Tile that the player is looking at based on direction.
    }

    updateAimedTile(map){
        this.aimedTile = map.tiles[Math.round(this.x + this.direction[0])][Math.round(this.y + this.direction[1])];
    }

    updateMovement(map) { 
        let x = this.movementAxis[0];
        let y = this.movementAxis[1];

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

        this.movementAxis = [x, y];
    }

    pickup(droppedItems) {
        droppedItems.forEach(item => {            
            if (item.x === this.closestX && item.y === this.closestY) {
                let actualItem = item.item;
                if (!this.items.includes(actualItem)) {
                    switch (actualItem) {
                        case items.wood:
                            this.resources.wood += speed;
                            break;
                        case items.food:
                            this.resources.food += speed;
                            break;
                        case items.gold:
                            this.resources.gold += speed;
                            break;
                        case items.stone:
                            this.resources.stone += speed;
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
                     
        this.movementAxis[0] += x;
        this.movementAxis[1] += y;

        this.movementAxis[0] = this.movementAxis[0].clamp(-0.12, 0.12);
        this.movementAxis[1] = this.movementAxis[1].clamp(-0.12, 0.12);

        console.log(this.movementAxis);

        return map.tiles[this.closestX][this.closestY];
    }
}