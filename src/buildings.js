import terrain from './terrain.js';
import Spritesheet from './classes/spritesheet.js';
import items from './items.js';

const buildings = {
    hall: {
        name: "Hall",
        icon: './assets/img/hammer.png',
        width: 5,
        height: 3,
        spritesheet: new Spritesheet('./assets/img/buildings/hall.png', 320, 192), 
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
    tower: {
        name: "Tower",
        icon: './assets/img/hammer.png',
        width: 2,
        height: 2,
        spritesheet: new Spritesheet('./assets/img/buildings/tower.png', 128, 128), 
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
    farm: {
        name: "Farm",
        icon: './assets/img/hammer.png',
        width: 3,
        height: 3,
        spritesheet: new Spritesheet('./assets/img/buildings/farm.png', 192, 192), 
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
    wall: {
        name: "Wall",
        icon: './assets/img/hammer.png',
        width: 4,
        height: 1,
        spritesheet: new Spritesheet('./assets/img/buildings/wall.png', 256, 64), 
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
    gate: {
        name: "Gate",
        icon: './assets/img/hammer.png',
        width: 4,
        height: 1,
        spritesheet: new Spritesheet('./assets/img/buildings/gate.png', 256, 64), 
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
    fortress: {
        name: "Fortress",
        icon: './assets/img/hammer.png',
        width: 4,
        height: 4,
        spritesheet: new Spritesheet('./assets/img/buildings/fortress.png', 256, 256), 
        requires: [
            [items.wood, 200],
            [items.stone, 200],
        ],
        drops: [
            [items.wood, 100],
            [items.stone, 100],
        ],
        maxHealth: 1000,
    }
}

buildings.forEach(b => {
    let image = buildings[b].icon;    
    buildings[b].icon = new Image();
    buildings[b].icon.src = image;
});

Object.freeze(buildings);

export default buildings;