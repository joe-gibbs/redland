import Item from './classes/item.js';

const items = {
    "axe": new Item('Axe', './assets/img/axe.png'),
    "pick": new Item('Pick', './assets/img/axe.png'),
    "wood": new Item('Wood', './assets/img/logs.png'),
    "gold": new Item('Gold', './assets/img/axe.png'),
    "stone" : new Item('Stone', './assets/img/axe.png'),
    "food": new Item('Food', './assets/img/axe.png'),
}

Object.freeze(items);

export default items;