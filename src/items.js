import Item from './classes/item.js';

const items = {
    "axe": new Item('Axe', './assets/img/axe.png'),
    "pick": new Item('Pick', './assets/img/pick.png'),
    "shovel": new Item('Shovel', './assets/img/shovel.png'),
    "wood": new Item('Wood', './assets/img/logs.png'),
    "gold": new Item('Gold', './assets/img/logs.png'),
    "stone" : new Item('Stone', './assets/img/logs.png'),
    "food": new Item('Food', './assets/img/logs.png'),
    "boat": new Item('Boat', './assets/img/raft.png'),
}

Object.freeze(items);

export default items;