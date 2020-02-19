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

        /**
         * @type {Image}
         */
        this.treasureMap = new Image();
        this.background = new Image(512, 512);
        this.background.src = './assets/img/map-border.png';
        this.uiX = 0;
        this.uiY = 0;
    }

    /**
     * 
     * @param {Number} tileSize The size of each tile
     */
    render(mouseX, mouseY, player) {
        let uiX = (this.canvasWidth / 1.2) - 128;
        let uiY = this.canvasHeight / 1.2;

        this.renderItems(uiX, uiY);

        if (player.showCraftingMenu) {
            this.renderCraftingMenu(mouseX, mouseY);
        }

        this.renderResources();
    }

    renderResources() {
        let tileSize = 64;
        if (this.canvasWidth < (64 * 6)) {
            tileSize = this.canvasWidth / 6;
        }
        let uiX = (this.canvasWidth) - (tileSize * 6);
        let uiY = tileSize;

        this.canvas.font = (tileSize * 0.75) + "px Pixelated";
        this.canvas.fillStyle = 'rgba(255,255,255,0.3)';
        this.canvas.fillRect(uiX, uiY, (tileSize * 3), tileSize);
        this.canvas.fillRect(uiX + (tileSize * 3), uiY, (tileSize * 3), tileSize);
        this.canvas.strokeRect(uiX, uiY, tileSize, tileSize);
        this.canvas.drawImage(items.wood.image, uiX, uiY, tileSize, tileSize);
        this.canvas.strokeRect(uiX + (tileSize * 3), uiY, tileSize, tileSize);
        this.canvas.drawImage(items.stone.image, uiX + (tileSize * 3), uiY, tileSize, tileSize);
        this.canvas.fillStyle = 'rgba(0,0,0,1)';
        this.canvas.fillText(this.player.resources.stone, uiX + (tileSize * 3) + tileSize + (tileSize * 0.25), uiY + (tileSize * 0.75));
        this.canvas.fillText(this.player.resources.wood, uiX + tileSize + (tileSize * 0.25), uiY + (tileSize * 0.75));
    }

    dropItem(mouseX, mouseY, droppedItems) 
    {
        let uiX = this.uiX;
        let uiY = this.uiY;

        if ((mouseX > uiX && mouseX < uiX + 64) && (mouseY > uiY && mouseY < uiY + 64) && this.player.items[0]) {
            this.player.drop(droppedItems, this.player.items[0]);
        }

        uiX += 64;

        if ((mouseX > uiX && mouseX < uiX + 64) && (mouseY > uiY && mouseY < uiY + 64) && this.player.items[1]) {
            this.player.drop(droppedItems, this.player.items[1]);
        }
    }

    renderItems(uiX, uiY) {
        this.uiX = uiX;
        this.uiY = uiY;
        this.canvas.lineWidth = 5;
        this.canvas.fillStyle = 'rgba(255,255,255,0.3)';
        this.canvas.fillRect(uiX, uiY, 64, 64);
        this.canvas.fillRect(uiX + 64, uiY, 64, 64);
        this.canvas.strokeRect(uiX, uiY, 64, 64);
        this.canvas.strokeRect(uiX + 64, uiY, 64, 64);
        
        if (this.player.items[0]) {
            this.canvas.drawImage(this.player.items[0].image, uiX, uiY);
        }
        if (this.player.items[1]) {
            this.canvas.drawImage(this.player.items[1].image, uiX + 64, uiY);
        }
        this.canvas.fillStyle = 'rgba(0,0,0,1)';
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