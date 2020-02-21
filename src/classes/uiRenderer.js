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
        this.craftingIcon = new Image();
        this.craftingIcon.src = './assets/img/crafting_menu.png';
        this.background.src = './assets/img/map-border.png';
        this.mapIcon = new Image();
        this.mapIcon.src = './assets/img/action_button.png';
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

        this.renderMapIcon(mouseX, mouseY);
        this.renderCraftingIcon(mouseX, mouseY);

        this.renderItems(uiX, uiY);
        
        this.renderResources();
            if (player.showCraftingMenu) {
                this.renderCraftingMenu(mouseX, mouseY);
            }
    }

    renderResources() {
        let tileSize = 32;
        if (this.canvasWidth < (32 * 6)) {
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

    renderMapIcon(mouseX, mouseY) {
        let size = 64;
        let x = size / 4;
        let y = this.canvasHeight / 5;
        let fillStyle = this.canvas.fillStyle;
        this.canvas.fillStyle = "rgba(128,128,128,.2)";

        if (mouseX > x && mouseX < x + size && mouseY > y && mouseY < y + (size)) {
            this.canvas.fillStyle = "rgba(128,128,128,.5)";
        }

        this.canvas.fillRect(x, y, size, size);
        this.canvas.drawImage(this.mapIcon, x, y, size, size);
        this.canvas.fillStyle = fillStyle;

        this.canClickMap = function(clickX, clickY) {
            if (clickX > x && clickX < x + size && clickY > y && clickY < y + (size))
            {
                return true;
            }
            return false;
        };
    }

    renderCraftingIcon(mouseX, mouseY) {
        let size = 64;
        let x = 64 / 4;
        let y = (this.canvasHeight / 5) + (size * 1.2);
        let fillStyle = this.canvas.fillStyle;
        this.canvas.fillStyle = "rgba(128,128,128,.2)";

        if (mouseX > x && mouseX < x + size && mouseY > y && mouseY < y + (size)) {
            this.canvas.fillStyle = "rgba(128,128,128,.5)";
        }

        this.canvas.fillRect(x, y, size, size);
        this.canvas.drawImage(this.craftingIcon, x, y, size, size);
        this.canvas.fillStyle = fillStyle;

        this.canClickCrafting = function(clickX, clickY) {
            if (clickX > x && clickX < x + size && clickY > y && clickY < y + (size))
            {
                return true;
            }
            return false;
        };
    }

    renderCraftingMenu(mouseX, mouseY) {
        let size = 64;
        if (this.canvasWidth < (9 * 64)) {
            size = this.canvasWidth / 9;
        }
        let recipeKeys = Object.keys(recipes);
        let x = (this.canvasWidth / 2) - (size * 4.5);
        let y = (this.canvasHeight / 2) - ((recipeKeys.length * (size)) / 2);
        let canvasFill = this.canvas.fillStyle;
        this.canvas.font = (size / 2) + "px Pixelated";

        this.selectedCraftable = null;

        recipeKeys.forEach(key => {
            if (recipes[key].canCraft(this.player)) {
                this.canvas.fillStyle = "rgba(0,0,0,0.5)";
            } else {
                this.canvas.fillStyle = "rgba(128,128,128,128.5)";
            }
            if (mouseX > x && mouseX < x + (9 * size) && mouseY > y && mouseY < y + (size) && recipes[key].canCraft(this.player)) {
                this.canvas.fillStyle = "rgba(255,255,255,0.9)";
                this.selectedCraftable = recipes[key];                
            }
            this.canvas.lineWidth = 5;
            this.canvas.strokeRect(x, y, (9 * size), (size));
            this.canvas.fillRect(x,y, (9 * size), (size));
            this.canvas.strokeRect(x, y, (size), (size));
            this.canvas.drawImage(recipes[key].item.image, x, y, size, size);
            this.canvas.fillStyle = canvasFill;
            this.canvas.fillText(recipes[key].item.name.toUpperCase(),x + (size * 1.2), y + (size * 0.7))
            this.canvas.strokeRect(x + (size), y, (2 * size), (size));
            
            let requirementsX = x + (size * 3);
            recipes[key].requirements.forEach(requirement => {
                this.canvas.strokeRect(requirementsX, y, (2 * size), (size));                        
                this.canvas.drawImage(items[requirement].image, requirementsX, y, size, size);
                this.canvas.fillText(recipes[key].requirements[requirement], requirementsX + (size), y + (size * 0.7));
                requirementsX += (2 * size);
            });          
            y += (size);
        });
        this.canvas.fillStyle = canvasFill;
    }
}