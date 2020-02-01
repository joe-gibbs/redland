"use strict";

import terrain from './src/terrain.js';
import DroppedItem from './src/classes/droppedItem.js';
import GameMap from './src/classes/gameMap.js';
import Player from './src/classes/player.js';
import MapGenerator from './src/classes/mapGenerator.js';
import fps from './src/fpsCounter.js';
import MapRenderer from './src/classes/mapRenderer.js';
import items from './src/items.js';

//Main function, put stuff here
window.onload = function() {
    let map = new GameMap(new MapGenerator().generate(1024, new SimplexNoise()));
    let centerTile;
    let player;
    let gameCanvas;
    let canvas;
    let mapRenderer;
    let tileSize;
    let canvasWidth;
    let canvasHeight;

    function handleKeyPress(event)
    {        
        switch (event.code) {
            case 'ArrowLeft': //left
                centerTile = player.move(1, 0, map)
                break;
            case 'ArrowUp': //up
                centerTile = player.move(0, 1, map)
                break;
            case 'ArrowRight': //right
                centerTile = player.move(-1, 0, map)
                break;
            case 'ArrowDown': //down
                centerTile = player.move(0, -1, map)
                break;
            case 'KeyE':
                player.pickup(map.droppedItems);
            case 'Enter':
                player.chop(map.tiles);
            default:
                break;
        }        
    }

    //Setup
    function setup() {                    
        
        centerTile = map.chooseRandomTile(terrain.LAND);

        map.droppedItems.push(new DroppedItem(centerTile.x + 1, centerTile.y + 1, items.axe));

        player = new Player(centerTile.x, centerTile.y);

        mapRenderer = new MapRenderer(tileSize, canvas, gameCanvas, map, player);

        window.addEventListener("keydown", handleKeyPress);
    }


    function update() {
        tileSize = window.innerWidth / 23;
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;
        tileSize = window.innerWidth / 23;
        canvas.font = canvasWidth/12 + "px Arial";
        canvas.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    
    
    function draw() {
        mapRenderer.render(centerTile);
    }

    function loop() {
        let fpsValue = fps.tick();
        window.fps.innerHTML = fpsValue;
        update();
        draw();
        window.requestAnimationFrame(loop);
    }

    gameCanvas = document.getElementById('game');
    canvas = gameCanvas.getContext("2d");

    update();
    setup();
     
    window.requestAnimationFrame(loop);
};