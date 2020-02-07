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

//FIX THE ARRAY OF IMAGES IN A TERRAIN so you can pick which tile gets printed off. 


const terrain = {
    "LAND": new Terrain('Land', true, false, Infinity, ['./assets/img/grass_1.png'], []),
    "SAND": new Terrain('Sand', true, false, Infinity, ['./assets/img/sand.png'], []),
    "WATER": new Terrain('Water', false, true, Infinity, ['./assets/img/water.png'], []),
    "ROCK": new Terrain('Rock', false, false, 500, ['./assets/img/rock.png'],[items.gold, items.stone]),
    "FOREST": new Terrain('Forest', false, false, 50, ['./assets/img/forest.png'], [items.wood]),
}

Object.freeze(terrain);

export default terrain;