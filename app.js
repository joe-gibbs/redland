"use strict";

import terrain from './src/terrain.js';
import DroppedItem from './src/classes/droppedItem.js';
import GameMap from './src/classes/gameMap.js';
import Player from './src/classes/player.js';
import MapGenerator from './src/classes/mapGenerator.js';
import fps from './src/fpsCounter.js';
import MapRenderer from './src/classes/mapRenderer.js';
import items from './src/items.js';
import UiRenderer from './src/classes/uiRenderer.js';

/** @type {GameMap} */
let map = new GameMap(new MapGenerator().generate(1024, new SimplexNoise()));

/** @type {Tile} */
let centerTile;

/** @type {Player} */
let player;

/** @type {HTMLElement} */
let gameCanvas;

/** @type {CanvasRenderingContext2D} */
let canvas;

/** @type {MapRenderer} */
let mapRenderer;

/** @type {UiRenderer} */
let uiRenderer;

/** @type {Number} */
let tileSize, canvasWidth, canvasHeight;

let mouseX = 0, mouseY = 0;

/** @type {String[]} */
let kMap = []; // You could also use an array

//Main function, put stuff here
window.onload = function() {
    /**
     * Handles inputs that you want done as a continuous series
     * @param {String[]} kMap 
     */
    function handleAxisMappings(kMap)
    {
        if (kMap['ArrowLeft']) {
            centerTile = player.move(0.1, 0, map)
        }
        if (kMap['ArrowUp']) {
            centerTile = player.move(0, 0.1, map)
        }
        if (kMap['ArrowRight']) {
            centerTile = player.move(-0.1, 0, map)
        }
        if (kMap['ArrowDown']) {
            centerTile = player.move(0, -0.1, map)
        }
    }

    /**
     * Handles inputs where you only want a single action to be taken
     * @param {String[]} kMap 
     */
    function handleActionMappings(kMap) {
        if (kMap['KeyM']) {
            player.showCraftingMenu = !player.showCraftingMenu;
        }
        if (kMap['KeyA']){
            player.switchItems();
        }
        if (kMap['KeyD']) {
            player.dropEquipped(map.droppedItems);
        }
        if (kMap['Enter'] || kMap['KeyS'] || kMap['KeyE']) {
            player.pickup(map.droppedItems);  
            player.chop(map);
        }
    }

    //Setup
    function setup() {                    
        centerTile = map.chooseRandomTile(terrain.LAND);

        let borders = centerTile.bordering(centerTile.x, centerTile.y, map.tiles, 2);
        for (let i = 0; i < borders.length; i++) {
            if (borders[i].type.walkable) {
                map.droppedItems.push(new DroppedItem(borders[i].x + 1, borders[i].y + 1, items.axe));
                break;
            }
        }

        player = new Player(centerTile.x, centerTile.y);

        mapRenderer = new MapRenderer(tileSize, canvas, map, player);

        uiRenderer = new UiRenderer(player, canvas, mouseX, mouseY);

            onkeydown = onkeyup = function(e){
                e = e || event; // to deal with IE
                kMap[e.code] = e.type == 'keydown';
                handleActionMappings(kMap);
        }
        
        document.onclick = function () {
            if (player.showCraftingMenu && uiRenderer.selectedCraftable) {
                uiRenderer.selectedCraftable.craft(player);
            }
        }

        document.onmousemove = findDocumentCoords;
        
        onresize = resize;
    }

    function findDocumentCoords(mouseEvent)
    {
      let xpos, ypos;
      if (mouseEvent)
      {
        xpos = mouseEvent.pageX;
        ypos = mouseEvent.pageY;
      }
      else
      {
        //IE
        xpos = window.event.x + document.body.scrollLeft - 2;
        ypos = window.event.y + document.body.scrollTop - 2;
      }
      mouseX = xpos;
      mouseY = ypos;      
    }

    function resize() {
        mapRenderer.updateRenderableLength(gameCanvas);        
    }


    function update() {
        canvasWidth = window.innerWidth; //Change Canvas size for preference*******
        canvasHeight = window.innerHeight; //Adjust tile size as well. 
        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;
        tileSize = 64;// NEED TO ADJUST TILE SIZE WITH CANVAS SIZE
        canvas.font = canvasWidth/48 + "px Pixelated";
        canvas.fillRect(0, 0, canvasWidth, canvasHeight);
        if (player) {
            player.updateMovement(map);
            handleAxisMappings(kMap);
        }
    }
    
    
    function draw() {
        mapRenderer.render(centerTile, player);        
        uiRenderer.render(tileSize, mouseX, mouseY);
    }

    function loop() {
        let fpsValue = fps.tick();
        window.fps.innerHTML = fpsValue;
        draw();
        window.requestAnimationFrame(loop);
    }

    gameCanvas = document.getElementById('game');
    canvas = gameCanvas.getContext("2d");

    update();
    setup();
     
    window.requestAnimationFrame(loop);
    this.setInterval(update, 16);
};

