import items from './items.js';

class Terrain {
    /**
     * 
     * @param {String} name 
     * @param {Boolean} walkable 
     * @param {Boolean} sailable 
     * @param {Number} health 
     * @param {String[]} images 
     * @param {items[]} drops 
     */
    constructor(name, walkable, sailable, health, images, drops) {
        this.tile = new Image();
        this.tile.src = images;
        this.name = name;
        this.walkable = walkable;
        this.drops = drops;
        this.sailable = sailable;
        this.health = health;
    }
}

const terrain = {
    "LAND": new Terrain('Land', true, false, 50, ['./assets/img/grass_2.png'],[]),
    "TALL_GRASS": new Terrain('Tall Grass', true, false, 50, ['./assets/img/grass_1.png'], []),
    "SAND": new Terrain('Sand', true, false, 50, ['./assets/img/sand.png'], []),
    "WATER": new Terrain('Water', false, true, Infinity, ['./assets/img/water.png'], []),
    "ROCK": new Terrain('Rock', false, false, 500, ['./assets/img/rock.png'],[items.stone]),
    "FOREST": new Terrain('Forest', false, false, 50, ['./assets/img/forest.png'], [items.wood]),
    "BARRIER": new Terrain('Barrier', false, false, Infinity, ['./assets/img/barrier.png'], []),
    "TREASURE": new Terrain('Treasure', true, false, 50, ['./assets/img/grass_2.png'], [items.treasure]),
    "TREASUREPIECE": new Terrain('Treasure Piece', true, false, 50, ['./assets/img/grass_2.png'], []),
}

Object.freeze(terrain);
export default terrain;