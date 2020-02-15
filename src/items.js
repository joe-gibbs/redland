import Item from './classes/item.js';
import Treasure from './classes/treasure.js';

const items = {
    "axe": new Item('Axe', './assets/img/axe.png'),
    "pick": new Item('Pick', './assets/img/pick.png'),
    "shovel": new Item('Shovel', './assets/img/shovel.png'),
    "wood": new Item('Wood', './assets/img/logs.png'),
    "gold": new Item('Gold', './assets/img/rocks.png'),
    "stone": new Item('Stone', './assets/img/rocks.png'),
    "food": new Item('Food', './assets/img/blueberry.png'),
    "boat": new Item('Boat', './assets/img/raft.png'),
    "map": new Item('Map', './assets/img/world_map.png'),
    "treasure": new Treasure('Treasure')
}

Object.freeze(items);

export default items;