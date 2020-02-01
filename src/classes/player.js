import DroppedItem from './droppedItem.js';
import terrain from '../terrain.js';

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
        this.items = [];
        this.health = 100;
        this.direction = [0,1];
    }

    pickup(droppedItems) {
        droppedItems.forEach(item => {            
            if (item.x === this.x && item.y === this.y) {
                let actualItem = item.item;
                if (!this.items.includes(actualItem)) {
                    this.items.push(actualItem);
                    droppedItems.remove(item);
                }
            }
        });
    }

    drop(droppedItems, item) {
        droppedItems.push(new DroppedItem(this.x, this.y, item));
        this.items.remove(item);
    }

    chop(map) {
         map[this.x + this.direction[0]][this.y + this.direction[1]].type = terrain.LAND;
    }

    move(x,y, map) {   
        this.direction = [x, y];
        if (map.tiles[this.x + x][this.y + y].type.walkable) {
            this.x += x;
            this.y += y;
        }
                
        return map.tiles[this.x][this.y];
    }
}