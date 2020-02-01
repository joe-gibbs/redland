class Terrain {
    constructor(name, walkable, health, image, transitionIndex, transitionImage, drops) {
        this.tile = new Image();
        this.tile.src = image;
        this.name = name;
        this.walkable = walkable;
        this.transitionIndex = transitionIndex,
        this.transitionTile = new Image();
        this.transitionTile.src = transitionImage;
        this.drops = drops;
        this.health = health;
    }
}

const terrain = {
    "LAND": new Terrain('Land', true, 20, './assets/img/grass.png', 1, './assets/img/c_grass.png', []),
    "SAND": new Terrain('Sand', true, 20, './assets/img/sand.png', 0, './assets/img/c_grass.png', []),
    "WATER": new Terrain('Water', false, Infinity, './assets/img/water.png', 2, './assets/img/c_water.png', []),
    "ROCK": new Terrain('Rock', false, 500, './assets/img/rock.png', 3, './assets/img/c_rock.png', []),
    "FOREST": new Terrain('Forest', false, 50, './assets/img/forest.png', 4, './assets/img/c_forest.png', []),
}

Object.freeze(terrain);

export default terrain;