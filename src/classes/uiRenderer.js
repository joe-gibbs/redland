import Player from './player.js';
import recipes from '../recipes.js';
import items from '../items.js';

export default class UiRenderer {

    /**
     * 
     * @param {Player} player 
     * @param {CanvasRenderingContext2D} canvas The canvas
     */
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;
        this.canvasWidth = canvas.canvas.width;
        this.canvasHeight = canvas.canvas.height;
    }

    /**
     * 
     * @param {Number} tileSize The size of each tile
     */
    render(tileSize) {
        let uiX = Math.ceil(this.canvasWidth / 1.5 / tileSize) * tileSize;
        let uiY = Math.ceil(this.canvasHeight / 80 / tileSize) * tileSize;

        this.renderItems(uiX, uiY);

        if (this.player.showCraftingMenu) {
            this.renderCraftingMenu();
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

    renderCraftingMenu() {
        let recipeKeys = Object.keys(recipes);
        let x = (this.canvasWidth / 2) - 288;
        let y = (this.canvasHeight / 2) - ((recipeKeys.length * 64) / 2);
        let canvasFill = this.canvas.fillStyle;
        this.canvas.font = "32px Pixelated";

        recipeKeys.forEach(key => {
            this.canvas.fillStyle = "rgba(0,0,0,0.5)";
            this.canvas.lineWidth = 5;
            this.canvas.strokeRect(x, y, 576, 64);
            this.canvas.fillRect(x,y, 576, 64);
            this.canvas.strokeRect(x, y, 64, 64);
            this.canvas.drawImage(recipes[key].item.image, x, y);
            this.canvas.fillStyle = canvasFill;
            this.canvas.fillText(recipes[key].item.name.toUpperCase(),x + 96, y + 40)
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