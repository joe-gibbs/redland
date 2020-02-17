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

const MapSize = 192;

let gameTime = 0.0;

/** @type {GameMap} */
let map;

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
window.onload = load;

function load() {
    map = new GameMap(new MapGenerator().generate(MapSize, new SimplexNoise())); //218  - 256 are good Sizes for visibility and reduced blur.
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
        if (kMap['TouchVector']) {
            centerTile = player.move(-kMap['TouchVector'].x / 20, kMap['TouchVector'].y / 20, map);
        }
    }

    /**
     * Handles inputs where you only want a single action to be taken
     * @param {String[]} kMap 
     */
    function handleActionMappings(kMap) {
        if (kMap['KeyG']) {
            player.showMap = false;
            player.showCraftingMenu = !player.showCraftingMenu;
        }
        if (kMap['Escape']) {
            player.showCraftingMenu = false;
            player.showMap = false;
        }
        if (kMap['KeyA']){
            player.switchItems();
        }
        if (kMap['KeyD']) {
            player.dropEquipped(map.droppedItems);
        }

        if (kMap['KeyM']) {
            if (player.items.includes(items.map)) {
                player.showMap = !player.showMap;
            }
            else {
                player.showMap = false;
            }
        }

        if (kMap['Enter'] || kMap['KeyS'] || kMap['KeyE']) {
            player.showCraftingMenu = false;

            player.pickup(map.droppedItems);

            player.chop(map);
        }
    }

    function ChangeTileType(tile, terrainType){
        tile.type = terrainType;
        return {x: tile.x, y: tile.y};
    }

    //Setup
    function setup() { 
        let treasure;
        let mapPieces = [];
        try {
            centerTile = map.chooseRandomTile(terrain.LAND);
            treasure = map.chooseRandomTile(terrain.LAND);
            mapPieces[0] = map.chooseRandomTile(terrain.LAND);
            mapPieces[1] = map.chooseRandomTile(terrain.LAND);
            mapPieces[2] = map.chooseRandomTile(terrain.LAND);
        } catch (error) {            
            load();
        }
        let treasureLocation = ChangeTileType(treasure, terrain.TREASURE);
        let mapPiece1 = ChangeTileType(mapPieces[0], terrain.TREASUREPIECE);
        let mapPiece2 = ChangeTileType(mapPieces[1], terrain.TREASUREPIECE);
        let mapPiece3 = ChangeTileType(mapPieces[2], terrain.TREASUREPIECE);

        map.droppedItems.push(new DroppedItem(mapPiece1.x, mapPiece1.y, items.mapPiece1));
        map.droppedItems.push(new DroppedItem(mapPiece2.x, mapPiece2.y, items.mapPiece2));
        map.droppedItems.push(new DroppedItem(mapPiece3.x, mapPiece3.y, items.mapPiece3));
        console.log(map.droppedItems)


        let borders = centerTile.bordering(centerTile.x, centerTile.y, map.tiles, 2);

        //Axe spawns near player.
        for (let i = 0; i < borders.length; i++) {
            if (borders[i].type.walkable) {
                map.droppedItems.push(new DroppedItem(borders[i].x + 1, borders[i].y + 1, items.axe));
                map.droppedItems.push(new DroppedItem(borders[i].x + 2, borders[i].y + 1, items.map)); 
                // map.droppedItems.push(new DroppedItem(borders[i].x + 2, borders[i].y + 2, items.mapPiece1));
                // map.droppedItems.push(new DroppedItem(borders[i].x + 2, borders[i].y + 3, items.mapPiece2));
                // map.droppedItems.push(new DroppedItem(borders[i].x + 2, borders[i].y + 4, items.mapPiece3));  
                break;
            }
        }

        player = new Player(centerTile.x, centerTile.y, treasureLocation);

        mapRenderer = new MapRenderer(tileSize, canvas, map, player);

        uiRenderer = new UiRenderer(player, canvas);

        uiRenderer.treasureMap.src = (MapGenerator.generateTreasureMap(canvas, map.tiles, "Treasure Piece"));

        /**
         * Enable touch controls for touchscreen
         */
        let dynamic;
        let touched = false;

        window.addEventListener('touchstart', function() {
            if (!touched) {
                dynamic = nipplejs.create({
                    zone: document.getElementById('dynamic'),
                    color: 'gray'
                });
                touched = true;
                dynamic.on('move', function(evt, data) {     
                    kMap['TouchVector'] = data.vector;
                });
        
                dynamic.on('end', function(evt, data) {   
                    kMap['TouchVector'] = {
                        x: 0,
                        y: 0,
                    };
                });
            }
        });
  

        onkeydown = onkeyup = function(e){
            e.preventDefault();
            e = e || event; // to deal with IE
            kMap[e.code] = e.type == 'keydown';
            handleActionMappings(kMap);
        }
        
        document.onclick = function () {
            if (player.showCraftingMenu && uiRenderer.selectedCraftable) {
                uiRenderer.selectedCraftable.craft(player, map.droppedItems);
            }
        }

        document.onmousemove = findDocumentCoords;
        document.oncontextmenu = e => e.preventDefault();
        
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
        uiRenderer.canvasHeight = canvasHeight;
        uiRenderer.canvasWidth = canvasWidth; 
    }


    function update() {
        canvasWidth = window.innerWidth; //Change Canvas size for preference*******
        canvasHeight = window.innerHeight; //Adjust tile size as well. 
        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;
        tileSize = 64;// NEED TO ADJUST TILE SIZE WITH CANVAS SIZE
        canvas.font = (canvasWidth + canvasHeight) / 92 + "px Pixelated";
        canvas.fillRect(0, 0, canvasWidth, canvasHeight);
        if (player && !player.showMap) {
            player.updateMovement(map);
            handleAxisMappings(kMap);
        }   
    }

    function updateTime() {
        gameTime += 0.015;
        if (gameTime >= 2400) {
            gameTime = 0;
        }
        let brightness = Math.max(10, Math.min(((1 - (Math.sin(gameTime / 240))) * 100), 100));
        
        gameCanvas.style.filter = "brightness(" + brightness + "%)";
    }
    
    function draw() {
        mapRenderer.render(centerTile, player);        
        uiRenderer.render(mouseX, mouseY, player);
    }

    function gameLoop() {
        let fpsValue = fps.tick();
        window.fps.innerHTML = fpsValue;
        update();
        draw();
        // updateTime();
    }

    gameCanvas = document.getElementById('game');
    gameCanvas.style.display = "block";
    canvas = gameCanvas.getContext("2d");    

    update();
    setup();
    setInterval(gameLoop, 16);
};