import items from './items.js';
import Spritesheet from './classes/spritesheet.js';

class Terrain {
    /**
     * 
     * @param {Object} options 
     */
    constructor( options ) {
        this.sprite = new Spritesheet(options.spritesheet.uri, options.spritesheet.width, options.spritesheet.height);
        // this.tile.addAnimationSet('1', 0, 0);
        // this.tile.addAnimationSet('2', 0, 0);
        // this.tile.addAnimationSet('3', 0, 0);

        this.name = options.name;
        this.walkable = options.walkable;
        this.drops = options.drops;
        this.sailable = options.sailable;
        this.health = options.health;
    }
}

const terrain = {
    "LAND": new Terrain({
        name: 'Land',
        walkable: true,
        sailable: false,
        health: 50,
        drops: [],
        spritesheet: {
            uri: './assets/img/grass_2.png',
            width: 64,
            height: 64,
        },
    }),
    "TALL_GRASS": new Terrain({
        name: 'Tall Grass',
        walkable: true,
        sailable: false,
        health: 50,
        drops: [],
        spritesheet: {
            uri: './assets/img/grass_1.png',
            width: 64,
            height: 64,
        },
    }),
    "SAND": new Terrain({
        name: 'Sand',
        walkable: true,
        sailable: false,
        health: 50,
        drops: [],
        spritesheet: {
            uri: './assets/img/sand.png',
            width: 64,
            height: 64,
        },
    }),
    "WATER": new Terrain({
        name: 'Water',
        walkable: false,
        sailable: true,
        health: Infinity,
        drops: [],
        spritesheet: {
            uri: './assets/img/water.png',
            width: 64,
            height: 64,
        },
    }),
    "ROCK": new Terrain({
        name: 'Rock',
        walkable: false,
        sailable: false,
        health: 200,
        drops: [items.stone],
        spritesheet: {
            uri: './assets/img/rock.png',
            width: 64,
            height: 80,
        },
    }),
    "FOREST": new Terrain({
        name: 'Forest',
        walkable: false,
        sailable: false,
        health: 50,
        drops: [items.wood],
        spritesheet: {
            uri: './assets/img/forest.png',
            width: 64,
            height: 80,
        },
    }),
    "BARRIER": new Terrain({
        name: 'Barrier',
        walkable: false,
        sailable: false,
        health: Infinity,
        drops: [],
        spritesheet: {
            uri: './assets/img/barrier.png',
            width: 64,
            height: 64,
        },
    }),
    "TREASURE": new Terrain({
        name: 'Treasure',
        walkable: true,
        sailable: false,
        health: 50,
        drops: [items.treasure],
        spritesheet: {
            uri: './assets/img/grass_2.png',
            width: 64,
            height: 64,
        },
    }),
    "TREASUREPIECE": new Terrain({
        name: 'Treasure Piece',
        walkable: true,
        sailable: false,
        health: 50,
        drops: [],
        spritesheet: {
            uri: './assets/img/grass_2.png',
            width: 64,
            height: 64,
        },
    }),
}

Object.freeze(terrain);
export default terrain;