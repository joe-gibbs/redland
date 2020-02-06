import Player from './player.js';

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

        let iter = 0;
        for (var key in this.player.resources) {
            iter++;
            this.canvas.fillText(key + ' ' + this.player.resources[key], uiX, uiY + (32 * iter));
        }

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
}