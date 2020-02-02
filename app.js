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

//Main function, put stuff here
window.onload = function() {
    let map = new GameMap(new MapGenerator().generate(1024, new SimplexNoise()));
    let centerTile;
    let player;
    let gameCanvas;
    let canvas;
    let mapRenderer;
    let uiRenderer;
    let tileSize;
    let canvasWidth;
    let canvasHeight;

    function handleDropPickup() {
        if (player.items.length < 1){
            player.pickup(map.droppedItems);
        } else {
            for(var i = 0; i < player.items.length; i++){
                if(player.items[i].name === player.equipped){
                    player.drop(map.droppedItems, player.items[i]);  
                } 
            }
        }
    }

    function handleKeyPress(event)
    {        
        switch (event.code) {
            case 'ArrowLeft': //left
                centerTile = player.move(.2, 0, map)
                break;
            case 'ArrowUp': //up
                centerTile = player.move(0, .2, map)
                break;
            case 'ArrowRight': //right
                centerTile = player.move(-.2, 0, map)
                break;
            case 'ArrowDown': //down
                centerTile = player.move(0, -.2, map)
                break;
            case 'KeyE':
            case 'KeyS':
            case 'Enter':
                let working = player.chop(map);
                if (!working){
                    handleDropPickup();  
                }   
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

        uiRenderer = new UiRenderer(player);

        window.addEventListener("keydown", handleKeyPress);
    }


    function update() {
        canvasWidth = window.innerWidth; //Change Canvas size for preference*******
        canvasHeight = window.innerHeight; //Adjust tile size as well. 
        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;
        tileSize = 64;// NEED TO ADJUST TILE SIZE WITH CANVAS SIZE
        canvas.font = canvasWidth/48 + "px Arial";
        canvas.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    
    
    function draw() {
        mapRenderer.render(centerTile, player);
        uiRenderer.render(canvas, canvasWidth, canvasHeight, tileSize);
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