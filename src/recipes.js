import CraftableItem from './classes/craftableItem.js';
import items from './items.js';

const recipes = {
    pick: new CraftableItem(items.pick,
        {
            wood: 70,
            stone: 0,
        }
    ),
    shovel: new CraftableItem(items.shovel,
        {
            wood: 50,
            stone: 20,
        }
    ),
    boat: new CraftableItem(items.boat,
        {
            wood: 100,
            stone: 0,
        }
    ),
    map: new CraftableItem(items.completedMap,
        {
            mapPiece1: 1,
            mapPiece2: 1,
            mapPiece3: 1
        }   
    )
};

Object.freeze(recipes);

export default recipes;