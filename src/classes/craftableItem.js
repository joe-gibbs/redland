import Item from './item.js';

export default class CraftableItem {
    /**
     * 
     * @param {Item} item 
     * @param {Object} requirements 
     */
    constructor(item, requirements) {
        this.item = item;
        this.requirements = requirements;
    }

    craft(player) {

    }
}