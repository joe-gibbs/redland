import Player from './player.js';
import recipes from '../recipes.js';
import items from '../items.js';
import CraftableItem from './craftableItem.js';
import Spritesheet from './spritesheet.js';

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
        this.manual = new Image();
        this.manual.src = './assets/img/Manual.png';
        this.hearts = new Spritesheet('./assets/img/hearts.png', 32, 32);
        this.showManual = true;
        this.treasureMap = new Image();
        this.background = new Image(512, 512);
        this.craftingIcon = new Image();
        this.craftingIcon.src = './assets/img/crafting_menu.png';
        this.background.src = './assets/img/map-border.png';
        this.mapIcon = new Image();
        this.mapIcon.src = './assets/img/action_button.png';
        this.toggleButton = new Image();
        this.toggleButton.src = './assets/img/toggle_button.png';
        this.uiX = 0;
        this.uiY = 0;
    }

    /**
     * 
     * @param {Number} tileSize The size of each tile
     */
    render(mouseX, mouseY, player, pieceMap, treasureMap) {
        let uiX = (this.canvasWidth / 1.2) - 128;
        let uiY = this.canvasHeight / 1.2;

        this.renderActionIcon(mouseX, mouseY);
        this.renderCraftingIcon(mouseX, mouseY);
        this.renderItems(uiX, uiY);

        if (player.showCraftingMenu) {
            this.renderCraftingMenu(mouseX, mouseY);
        }

        if(player.showPieceMap){
            pieceMap.renderMap(this.canvasWidth, this.canvasHeight);
        } else if (player.showTreasureMap){
            treasureMap.renderMap(this.canvasWidth, this.canvasHeight);
        }

        this.renderResources();
        this.renderHearts();

        if(this.showManual){
            this.renderManual();
        }
    }

    renderManual(){
        this.canvas.drawImage(this.manual, (this.canvasWidth - this.manual.width) /2, this.canvasHeight/7, this.manual.width, this.manual.height);
    }

    renderHearts() {
        let x = 64;
        let y =  32;
        if (this.canvasWidth < (64 * 7)) {
            x = this.canvasWidth - 32 * 4;
            y = 0;
        }
        // this.hearts.animationSets['empty'];
        this.hearts.render(1, x, y, this.canvas);
    }

    renderResources() {
        let tileSize = 64;
        let uiX = (this.canvasWidth) - (tileSize * 6);
        if (this.canvasWidth < (64 * 7)) {
            tileSize = this.canvasWidth / 6;
            uiX = (this.canvasWidth) - (tileSize * 5);
        }
        let uiY = tileSize / 2;

        this.canvas.font = (tileSize * 0.75) + "px Pixelated";
        this.canvas.fillStyle = '#E9D7A9';
        this.canvas.fillRect(uiX, uiY, (tileSize * 5), tileSize);
        this.canvas.strokeStyle = "#BFB092"
        this.canvas.strokeRect(uiX, uiY, (tileSize * 2.5), tileSize);
        this.canvas.drawImage(items.wood.image, uiX, uiY, tileSize, tileSize);
        this.canvas.strokeRect(uiX + (tileSize * 2.5), uiY, (tileSize * 2.5), tileSize);
        this.canvas.drawImage(items.stone.image, uiX + (tileSize * 2.5), uiY, tileSize, tileSize);
        this.canvas.fillStyle = 'rgba(0,0,0,1)';
        this.canvas.fillText(this.player.resources.wood, uiX + tileSize + (tileSize * 0.25), uiY + (tileSize * 0.75));
        this.canvas.fillText(this.player.resources.stone, uiX + (tileSize * 2.5) + tileSize + (tileSize * 0.25), uiY + (tileSize * 0.75));
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
        this.canvas.lineWidth = 4;
        this.canvas.fillStyle = '#E9D7A9';
        this.canvas.fillRect(uiX, uiY, 64, 64);
        this.canvas.fillRect(uiX + 64, uiY, 32, 32);
        this.canvas.strokeStyle = "#BFB092";
        this.canvas.strokeRect(uiX, uiY, 64, 64);
        this.canvas.strokeRect(uiX + 64, uiY, 32, 32);
        
        this.canvas.drawImage(this.toggleButton, uiX - 64, uiY);
        
        this.canClickToggleButton = function(clickX, clickY) {
            if (clickX > uiX - 64 && clickX < uiX && clickY > uiY && clickY < uiY + (64))
            {
                return true;
            }
            return false;
        };

        if (this.player.items[0]) {
            this.canvas.drawImage(this.player.items[0].image, uiX, uiY);
        }
        if (this.player.items[1]) {
            this.canvas.drawImage(this.player.items[1].image, uiX + 64, uiY, 32 ,32);
        }
        this.canvas.fillStyle = 'rgba(0,0,0,1)';

    }

    renderCraftingIcon(mouseX, mouseY) {
        let size = 64;
        let x = this.canvasWidth - size - 20;
        let y = (this.canvasHeight / 2) + (-size * 0.2);
        let fillStyle = this.canvas.fillStyle;
        this.canvas.fillStyle = "rgba(128,128,128,0)";

        if (mouseX > x && mouseX < x + size && mouseY > y && mouseY < y + (size)) {
            this.canvas.fillStyle = "rgba(255,255,255,.2)";
        }

        this.canvas.drawImage(this.craftingIcon, x, y, size, size);
        this.canvas.fillRect(x, y, size, size);
        this.canvas.fillStyle = fillStyle;

        this.canClickCrafting = function(clickX, clickY) {
            if (clickX > x && clickX < x + size && clickY > y && clickY < y + (size))
            {
                return true;
            }
            return false;
        };
    }

    renderActionIcon(mouseX, mouseY) {
        let size = 64; 
        let x = this.canvasWidth - size - 20;
        let y = (this.canvasHeight / 2) + (size * 1.2);
        let fillStyle = this.canvas.fillStyle;
        this.canvas.fillStyle = "rgba(128,128,128,0)";

        if (mouseX > x && mouseX < x + size && mouseY > y && mouseY < y + (size)) {
            this.canvas.fillStyle = "rgba(255,255,255,.2)";
        }

        this.canvas.drawImage(this.mapIcon, x, y, size, size);
        this.canvas.fillRect(x, y, size, size);
        this.canvas.fillStyle = fillStyle;

        this.canClickMap = function(clickX, clickY) {
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

        this.canvas.fillStyle = "#E9D7A9";
        this.canvas.fillRect(x - size, y - size, (11 * size), (7 * size));

        let craftingMenuSize = 0;
        recipeKeys.forEach(key => {
            if (recipes[key].canCraft(this.player)) {
                this.canvas.fillStyle = "#7E8DC3";
                this.canvas.strokeStyle = '#687BAB'
            } else {
                this.canvas.fillStyle = "#687BAB";
                this.canvas.strokeStyle = '#7E8DC3'
            }
            if (mouseX > x && mouseX < x + (9 * size) && mouseY > y && mouseY < y + (size) && recipes[key].canCraft(this.player)) {
                this.canvas.fillStyle = "rgba(255,255,255,0.9)";
                this.selectedCraftable = recipes[key];           
                this.canvas.strokeStyle = '#7E8DC3'     
            }
            this.canvas.fillRect(x,y, (9 * size), (size));
            this.canvas.strokeRect(x - 2, y - 2, (9 * size + 4), (size + 4));
            this.canvas.strokeRect(x - 2, y - 2, (size + 4), (size + 4));
            this.canvas.drawImage(recipes[key].item.image, x, y, size, size);
            this.canvas.fillStyle = canvasFill;
            this.canvas.fillText(recipes[key].item.name.toUpperCase(),x + (size * 1.2), y + (size * 0.7))
            
            let requirementsX = x + (size * 3) - 2;
            recipes[key].requirements.forEach(requirement => {
                this.canvas.strokeRect(requirementsX , y - 2, (2 * size + 1), (size + 4));                        
                this.canvas.drawImage(items[requirement].image, requirementsX + 4, y, size, size);
                this.canvas.fillText(recipes[key].requirements[requirement], requirementsX + (size) + 8, y + (size * 0.7));
                requirementsX += (2 * size);
            });         
            craftingMenuSize += size; 
            y += (size);
        });
        this.canvas.strokeStyle = '#000000';
        this.canvas.strokeRect(x - 2,  y - craftingMenuSize - 2, (9 * size) + 4,  craftingMenuSize + 4);

        this.canvas.fillStyle = canvasFill;
    }
}