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
            return 1;
        } else if (player.resources.mapPiece1 === this.requirements.mapPiece1 &&  player.resources.mapPiece2 === this.requirements.mapPiece2 && player.resources.mapPiece3 === this.requirements.mapPiece3){
            return 2;
        }
        return false;
    }

    /**
     * 
     * @param {Player} player 
     * @param {Item[]} droppedItems
     */
    craft(player, droppedItems) {
        let value = this.canCraft(player);
        if (value === 1) {
            player.showCraftingMenu = false;

            droppedItems.push(new DroppedItem(player.closestX, player.closestY, this.item));

            player.resources.stone -= this.requirements.stone;
            player.resources.wood -= this.requirements.wood;
        } else if(value === 2){
            player.showCraftingMenu = false;

            droppedItems.push(new DroppedItem(player.closestX, player.closestY, this.item));

            player.resources.mapPiece1 -= this.requirements.mapPiece1;
            player.resources.mapPiece2 -= this.requirements.mapPiece2;
            player.resources.mapPiece3 -= this.requirements.mapPiece3;
        }
    }
}