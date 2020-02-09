import Player from './player.js';
import recipes from '../recipes.js';
import items from '../items.js';
import CraftableItem from './craftableItem.js';

export default class UiRenderer {

    /**
     * 
     * @param {Player} player 
     * @param {CanvasRenderingContext2D} canvas The canvas
     * @param {Number} mouseX
     * @param {Number} mouseY
     */
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;
        this.canvasWidth = canvas.canvas.width;
        this.canvasHeight = canvas.canvas.height;
        /**
         * @type {CraftableItem}
         */
        this.selectedCraftable = null;
    }

    /**
     * 
     * @param {Number} tileSize The size of each tile
     */
    render(tileSize, mouseX, mouseY) {
        let uiX = Math.ceil(this.canvasWidth / 1.5 / tileSize) * tileSize;
        let uiY = Math.ceil(this.canvasHeight / 80 / tileSize) * tileSize;

        this.renderItems(uiX, uiY);

        if (this.player.showCraftingMenu) {
            this.renderCraftingMenu(mouseX, mouseY);
        }
    }

    renderItems(uiX, uiY) {
        let items = [];
        this.player.items.forEach(item => {
            if (item === this.player.equipped) {
                items.push('>' + item.name + '\n');
            }
            else
            {
                items.push(item.name + '\n');
            }
        });
        this.canvas.fillText(items.toString(), uiX, uiY + (500));

    }

    renderCraftingMenu(mouseX, mouseY) {
        let recipeKeys = Object.keys(recipes);
        let x = (this.canvasWidth / 2) - 288;
        let y = (this.canvasHeight / 2) - ((recipeKeys.length * 64) / 2);
        let canvasFill = this.canvas.fillStyle;
        this.canvas.font = "32px Pixelated";

        this.selectedCraftable = null;

        recipeKeys.forEach(key => {
            if (recipes[key].canCraft(this.player)) {
                this.canvas.fillStyle = "rgba(0,0,0,0.5)";
            } else {
                this.canvas.fillStyle = "rgba(128,128,128,128.5)";
            }
            if (mouseX > x && mouseX < x + 576 && mouseY > y && mouseY < y + 64 && recipes[key].canCraft(this.player)) {
                this.canvas.fillStyle = "rgba(255,255,255,0.9)";
                this.selectedCraftable = recipes[key];                
            }
            this.canvas.lineWidth = 5;
            this.canvas.strokeRect(x, y, 576, 64);
            this.canvas.fillRect(x,y, 576, 64);
            this.canvas.strokeRect(x, y, 64, 64);
            this.canvas.drawImage(recipes[key].item.image, x, y);
            this.canvas.fillStyle = canvasFill;
            this.canvas.fillText(recipes[key].item.name.toUpperCase(),x + 76, y + 40)
            this.canvas.strokeRect(x + 64, y, 128, 64);
            
            let requirementsX = x + 192;
            recipes[key].requirements.forEach(requirement => {
                this.canvas.strokeRect(requirementsX, y, 128, 64);                        
                this.canvas.drawImage(items[requirement].image, requirementsX, y);
                this.canvas.fillText(recipes[key].requirements[requirement], requirementsX + 64, y + 40);
                requirementsX += 128;
            });          
            y += 64;
        });
        this.canvas.fillStyle = canvasFill;
    }
}