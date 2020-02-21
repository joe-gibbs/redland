import CraftableItem from './classes/craftableItem.js';
import items from './items.js';

const recipes = {
    axe: new CraftableItem(items.axe,
        {
            wood: 50,
            stone: 0,
            // placeholder: null
        }
    ),
    pick: new CraftableItem(items.pick,
        {
            wood: 70,
            stone: 0,
            // placeholder: null
        }
    ),
    shovel: new CraftableItem(items.shovel,
        {
            wood: 50,
            stone: 20,
            // placeholder: null
        }
    ),
    boat: new CraftableItem(items.boat,
        {
            wood: 100,
            stone: 0,
            // placeholder: null
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