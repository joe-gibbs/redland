import terrain from './terrain.js';

const buildings = {
    fortress: {
        keys : [terrain.LAND, terrain.ROCK],
        map : [
            [1,1,1,1,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,1,0,1,1],
        ],
    },
    house: {  
        keys : [terrain.LAND, terrain.ROCK],
        map : [
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,1,1,1],
        ],
    },
    farm: {
        keys : [terrain.LAND],
        map : [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ],
    },
}

Object.freeze(buildings);

export default buildings;