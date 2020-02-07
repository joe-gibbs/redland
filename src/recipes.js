import CraftableItem from './classes/craftableItem.js';
import items from './items.js';

const recipes = {
    pick: new CraftableItem(items.pick,
        {
            wood: 100,
            stone: 0,
        }
    ),
    boat: new CraftableItem(items.boat,
        {
            wood: 20,
            stone: 0,
        }
    ),
};

Object.freeze(recipes);

export default recipes;