import terrain from './terrain.js';
import Spritesheet from './classes/spritesheet.js';
import items from './items.js';

const buildings = {
    fortress: {
        name: "Fortress",
        width: 4,
        height: 4,
        spritesheet: new Spritesheet('./assets/img/fortress.png', 256, 256), 
        requires: [
            [items.wood, 200],
            [items.stone, 200],
        ],
        drops: [
            [items.wood, 100],
            [items.stone, 100],
        ],
        maxHealth: 1000,
    },
}

Object.freeze(buildings);

export default buildings;