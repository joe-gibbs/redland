class Terrain {
    constructor(name, walkable, image, transitionIndex, transitionImage) {
        this.tile = new Image();
        this.tile.src = image;
        this.name = name;
        this.walkable = walkable;
        this.transitionIndex = transitionIndex,
        this.transitionTile = new Image();
        this.transitionTile.src = transitionImage;
    }
}

const terrain = {
    "LAND": new Terrain('Land', true, './assets/img/grass.png', 1, './assets/img/c_grass.png'),
    "SAND": new Terrain('Sand', true, './assets/img/sand.png', 0, './assets/img/c_grass.png'),
    "WATER": new Terrain('Water', false, './assets/img/water.png', 2, './assets/img/c_water.png'),
    "ROCK": new Terrain('Rock', false, './assets/img/rock.png', 3, './assets/img/c_rock.png'),
    "FOREST": new Terrain('Forest', false, './assets/img/forest.png', 4, './assets/img/c_forest.png'),
}

export default terrain;