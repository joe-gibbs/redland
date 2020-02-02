import DroppedItem from './droppedItem.js';
import terrain from '../terrain.js';
import items from '../items.js';

export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
        this.closestX = x;
        this.closestY = y;
        this.aimedTile; //Tile that the player is looking at based on direction.
    }

    updateAimedTile(map){
        this.aimedTile = map.tiles[Math.round(this.x + this.direction[0])][Math.round(this.y + this.direction[1])];
    }

    pickup(droppedItems) {
        droppedItems.forEach(item => {            
            if (item.x === this.closestX && item.y === this.closestY) {
                let actualItem = item.item;
                if (!this.items.includes(actualItem)) {
                    switch (actualItem) {
                        case items.wood:
                            this.resources.wood += 5;
                            break;
                        case items.food:
                            this.resources.food += 5;
                            break;
                        case items.gold:
                            this.resources.gold += 5;
                            break;
                        case items.stone:
                            this.resources.stone += 5;
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
            
        if (map.tiles[Math.round(this.x + x)][Math.round(this.y + y)].type.walkable) {
            this.x += x;
            this.y += y;
        }

        this.closestX = Math.round(this.x);
        this.closestY = Math.round(this.y);    
         
        this.updateAimedTile(map);
        return map.tiles[this.closestX][this.closestY];
    }
}