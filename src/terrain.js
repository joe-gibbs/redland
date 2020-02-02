import items from './items.js';

class Terrain {
    constructor(name, walkable, health, images, drops) {
        this.tile = new Image();
        this.tile.src = images;
        this.name = name;
        this.walkable = walkable;
        this.drops = drops;
        this.health = health;
    }
}

const terrain = {
    "LAND": new Terrain('Land', true, Infinity, ['./assets/img/grass_1.png'], []),
    "SAND": new Terrain('Sand', true, Infinity, ['./assets/img/sand.png'], []),
    "WATER": new Terrain('Water', false, Infinity, ['./assets/img/water.png'], []),
    "ROCK": new Terrain('Rock', false, 500, ['./assets/img/rock.png'],[items.gold, items.stone]),
    "FOREST": new Terrain('Forest', false, 50, ['./assets/img/forest.png'], [items.wood]),
}

Object.freeze(terrain);

export default terrain;