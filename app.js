import terrain from './src/terrain.js';
import DroppedItem from './src/classes/droppedItem.js';
import GameMap from './src/classes/gameMap.js';
import Player from './src/classes/actors/player.js';
import MapGenerator from './src/classes/mapGenerator.js';
import MapRenderer from './src/classes/mapRenderer.js';
import items from './src/items.js';
import UiRenderer from './src/classes/uiRenderer.js';
import Map from './src/classes/Map.js';

const MapSize = 256;

let gameTime = 0.0;

let progressBar = document.getElementById('progress');

let uiCanvas;

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

/** @type {Map} */
let pieceMap;

/** @type {Map} */
let treasureMap;

/** @type {Number} */
let tileSize, canvasWidth, canvasHeight;

let mouseX = 0, mouseY = 0;

/** @type {String[]} */
let kMap = []; // You could also use an array

progressBar.value += 10;
setInterval(function() {
    if (progressBar) {
        progressBar.value += 1;
    }
}, 10);

//Main function, put stuff here
window.addEventListener('load', load);

function load() {
    map = new GameMap(new MapGenerator().generate(MapSize, new SimplexNoise(), progressBar)); //218  - 256 are good Sizes for visibility and reduced blur.
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
            let x = kMap['TouchVector'].x;
            let y = kMap['TouchVector'].y;
            if (x != 0 && y != 0) {
                centerTile = player.move(-x / 25, y / 25, map);
            }
        }
        if (kMap['TouchDistance'] && kMap['TouchDistance'] === 50) {            
            player.chop(map);
        }
    }

    /**
     * Handles inputs where you only want a single action to be taken
     * @param {String[]} kMap 
     */
    function handleActionMappings(kMap) {
        if (kMap['KeyG']) {
            player.showPieceMap = false;
            player.showTreasureMap = false;
            player.showCraftingMenu = !player.showCraftingMenu;
        }
        if (kMap['Escape']) {
            player.showCraftingMenu = false;
            player.showPieceMap = false;
            player.showTreasureMap = false;
        }
        if (kMap['KeyA']){
            player.switchItems();
        }
        if (kMap['KeyD']) {
            player.dropEquipped(map.droppedItems);
        }
        if (kMap['Enter'] || kMap['KeyS'] || kMap['KeyE']) {
            handleAction(kMap['TouchVector']);
        }
    }

    function ChangeTileType(tile, terrainType){
        tile.type = terrainType;
        return {x: tile.x, y: tile.y};
    }

    function handleAction(touchVector) {
        player.showCraftingMenu = false;
        if (!touchVector) {  
            if (player.equipped === items.map){
                player.showPieceMap = !player.showPieceMap;
            } else if (player.equipped === items.completedMap){
                player.showTreasureMap = !player.showTreasureMap;
            }
        }
        let pickedUp = player.pickup(map.droppedItems);
        if (!pickedUp){
            player.chop(map); 
        }
    }

    //Setup
    function setup() { 
        let treasure, treasureLocation, mapPiece1, mapPiece2, mapPiece3;
        try {
            centerTile   = map.chooseRandomTile(terrain.LAND);
            treasure     = map.chooseRandomTile(terrain.LAND);
            treasureLocation = ChangeTileType(treasure, terrain.TREASURE);
            mapPiece1 = ChangeTileType(map.chooseRandomTile(terrain.LAND), terrain.TREASUREPIECE);
            mapPiece2 = ChangeTileType(map.chooseRandomTile(terrain.LAND), terrain.TREASUREPIECE);
            mapPiece3 = ChangeTileType(map.chooseRandomTile(terrain.LAND), terrain.TREASUREPIECE);
        } catch (error) {                      
            load();
        }

        map.droppedItems.push(new DroppedItem(mapPiece1.x, mapPiece1.y, items.mapPiece1));
        map.droppedItems.push(new DroppedItem(mapPiece2.x, mapPiece2.y, items.mapPiece2));
        map.droppedItems.push(new DroppedItem(mapPiece3.x, mapPiece3.y, items.mapPiece3));

        let borders = centerTile.bordering(centerTile.x, centerTile.y, map.tiles, 2);

        //Axe spawns near player.
        for (let i = 0; i < borders.length; i++) {
            if (borders[i].type.walkable) {
                map.droppedItems.push(new DroppedItem(borders[i].x, borders[i].y, items.map));  
                map.droppedItems.push(new DroppedItem(borders[i].x, borders[i].y, items.axe));
                break;
            }
        }

        player      = new Player(map, centerTile.x, centerTile.y, treasureLocation);
        mapRenderer = new MapRenderer(tileSize, canvas, map, player);
        uiRenderer  = new UiRenderer(player, uiCanvas);

        //Create Maps
        pieceMap = new Map(uiCanvas, map.tiles, player, "Treasure Piece");
        pieceMap.map.src = pieceMap.generateMap()

        treasureMap = new Map(uiCanvas, map.tiles, player, "Treasure");
        treasureMap.map.src = treasureMap.generateMap();


        /**
         * Enable touch controls for touchscreen
         */
        let dynamic;
        let touched = false;

        window.addEventListener('touchstart', function(e) {   
            e.preventDefault();         
            if (!touched) { 
                dynamic = nipplejs.create({
                    zone: document.getElementById('joystick-zone'),
                    mode: 'static',
                    zone: document.getElementById('dynamic'),
                    size: 100,
                    position: {bottom: '150px', left: '100px'},
                    color: 'white'
                });
                touched = true;                
            }
            
            dynamic.on('move', function(evt, data) {                
                kMap['TouchVector'] = data.vector;
                kMap['TouchDistance'] = data.distance;
            });
        
            dynamic.on('end', function(evt, data) {   
                kMap['TouchVector'] = {
                    x: 0,
                    y: 0,
                };
                kMap['TouchDistance'] = 0;
            });
        });
          
        /*if ('serviceWorker' in navigator) {            
            navigator.serviceWorker.register('/sw.js');
        }*/

        onkeydown = onkeyup = function(e){
            e.preventDefault();
            e = e || event; // to deal with IE
            kMap[e.code] = e.type == 'keydown';
            handleActionMappings(kMap);            
        }
        
        document.onclick = handleClick;

        function handleClick(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
      
            if (player.showCraftingMenu) {
                uiRenderer.renderCraftingMenu(mouseX, mouseY);
            }
            if (player.showCraftingMenu && uiRenderer.selectedCraftable) {
                uiRenderer.selectedCraftable.craft(player, map.droppedItems);
            }
            uiRenderer.dropItem(e.clientX, e.clientY, map.droppedItems);
            if (!player.showCraftingMenu && e.clientX > ((canvasWidth / 2) - 128) && e.clientX < ((canvasWidth / 2) + 128) && e.clientY > ((canvasHeight / 2) - 128) && e.clientY < ((canvasHeight / 2) + 128)) {
                player.pickup(map.droppedItems);
            }
            if (uiRenderer.canClickCrafting(mouseX, mouseY)) {
                player.showCraftingMenu = !player.showCraftingMenu;
            }
            else if (!uiRenderer.selectedCraftable) {
                player.showCraftingMenu = false;
            }
            if  (uiRenderer.canClickToggleButton(mouseX, mouseY)){
                player.switchItems();
            }

            if (uiRenderer.canClickMap(mouseX, mouseY)) {
                handleAction(false);
            }
            else {
                player.showPieceMap = false;
                player.showTreasureMap = false;
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
        uiCanvas.canvas.width = canvasWidth;
        uiCanvas.canvas.height = canvasHeight;
        tileSize = 64;// NEED TO ADJUST TILE SIZE WITH CANVAS SIZE
        canvas.font = (canvasWidth + canvasHeight) / 92 + "px Pixelated";
        canvas.fillRect(0, 0, canvasWidth, canvasHeight);
        if (player && !player.showPieceMap && !player.showTreasureMap) {
            player.updateMovement(map);
            handleAxisMappings(kMap);
        }   
    }

    function updateTime() {
        gameTime += -0.03;
        if (gameTime >= 2400) {
            gameTime = 0;
        }
        let brightness = Math.max(20, Math.min(((1 - (Math.sin(gameTime / 240))) * 100), 100));
        
        gameCanvas.style.filter = "brightness(" + brightness + "%)";
    }
    
    function draw() {
        document.getElementById('map').style.display = 'none';
        mapRenderer.render(centerTile, player);        
        uiRenderer.render(mouseX, mouseY, player, pieceMap, treasureMap);

        uiCanvas.fillStyle = 'rgba(0,0,0,0)';
    }

    function gameLoop() {
        update();
        draw();
        updateTime();
    }
    uiCanvas = document.getElementById('ui').getContext("2d");
    gameCanvas = document.getElementById('game');
    uiCanvas.canvas.style.display = "block";
    gameCanvas.style.display = "block";
    canvas = gameCanvas.getContext("2d");    

    update();
    setup();
    setInterval(gameLoop, 16);
};