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
        this.items = [];
        this.health = 100;
        this.direction = [0,1];
    }

    pickup(droppedItems) {
        droppedItems.forEach(item => {            
            if (item.x === this.x && item.y === this.y) {
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
                            this.items.push(actualItem);
                            break;
                    }
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
        let tile = map.tiles[this.x + this.direction[0]][this.y + this.direction[1]];
        tile.damage(1.5, map);
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