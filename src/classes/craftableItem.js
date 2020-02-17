import Item from './item.js';
import Player from './player.js';
import DroppedItem from './droppedItem.js';

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

    /**
     * 
     * @param {Player} player 
     */
    canCraft(player) {
        if (player.resources.stone >= this.requirements.stone && player.resources.wood >= this.requirements.wood) {
            return true;
        } else if (this.requirements.mapPiece1 <= player.resources.mapPiece1 && this.requirements.mapPiece2 <= player.resources.mapPiece2 && this.requirements.mapPiece3 <= player.resources.mapPiece3){
            return true
        }
        return false;
    }

    /**
     * 
     * @param {Player} player 
     * @param {Item[]} droppedItems
     */
    craft(player, droppedItems) {
        if (this.canCraft(player)) {
            player.showCraftingMenu = false;

            droppedItems.push(new DroppedItem(player.closestX, player.closestY, this.item));

            player.resources.mapPiece1 -= this.requirements.mapPiece1;
            player.resources.mapPiece2 -= this.requirements.mapPiece2;
            player.resources.mapPiece3 -= this.requirements.mapPiece3;
            player.resources.stone -= this.requirements.stone;
            player.resources.wood -= this.requirements.wood;
        }
    }
}