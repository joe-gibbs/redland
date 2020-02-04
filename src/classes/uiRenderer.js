import Player from './player.js';

export default class UiRenderer {

    /**
     * 
     * @param {Player} player 
     */
    constructor(player) {
        this.player = player;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas The canvas
     * @param {Number} canvasWidth The size of the canvas
     * @param {Number} canvasHeight 
     * @param {Number} tileSize The size of each tile
     */
    render(canvas, canvasWidth, canvasHeight, tileSize) {
        let uiX = Math.ceil(canvasWidth / 1.5 / tileSize) * tileSize;
        let uiY = Math.ceil(canvasHeight / 80 / tileSize) * tileSize;

        let iter = 0;
        for (var key in this.player.resources) {
            iter++;
            canvas.fillText(key + ' ' + this.player.resources[key], uiX, uiY + (32 * iter));
        }

        let items = [];
        this.player.items.forEach(item => {
            items.push(item.name + ' ');
        });
        canvas.fillText(items.toString(), uiX, uiY + (500));
    }
}