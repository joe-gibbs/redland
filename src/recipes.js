import CraftableItem from './classes/craftableItem.js';
import items from './items.js';

const recipes = {
    pick: new CraftableItem(items.pick,
        {
            wood: 100,
            stone: 50,
        }
    ),
    boat: new CraftableItem(items.boat,
        {
            wood: 200,
        }
    ),
};

Object.freeze(recipes);

export default recipes;