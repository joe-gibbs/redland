export default class Map {
    constructor(canvas, tiles, player, searchedItem){
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.canvas = canvas;
        this.player = player;
        this.tiles = tiles;
        this.searchedItem = searchedItem;
        this.map = new Image();
    }
    rotate180(a) {
        const w = a[0].length;
        const h = a.length;
        let b = new Array(h);
      
        for (let y = 0; y < h; y++) {
          let n = h - 1 - y;
          b[n] = new Array(w);
      
          for (let x = 0; x < w; x++) {
            b[n][w - 1 - x] = a[y][x];
          }
        }
      
        return b;
    
    }
    generateMap(){
        const hexToRGBA = hexStr => [
            parseInt(hexStr.substr(1, 2), 16),
            parseInt(hexStr.substr(3, 2), 16),
            parseInt(hexStr.substr(5, 2), 16),
            255
          ];
        
        const tileColor = tile => {
            let result = [];
            switch (tile) {
                case "Forest":
                    result = hexToRGBA('#165200');
                    break;
                case "Rock":
                    result = hexToRGBA('#515151');
                    break;
                case "Tall Grass":
                case "Land":
                    result = hexToRGBA('#097200');
                    break;
                case "Water":
                    result = hexToRGBA('#006DCA');
                    break;
                case this.searchedItem:
                    result = hexToRGBA('#FF0000');
                    break;
                default:
                    result = hexToRGBA('#E9D7A9');
                    break;
            }
            return result;
        }
    
        const rgba = 
            this.rotate180(this.tiles)
            .reduce((prev, next) => next.map((item, i) =>
            (prev[i] || []).concat(next[i])
            ), [])
            .flat(1)
            .map(tile => tile.type.name)  // 1d list of hex codes
            .map(tileColor)  // 1d list of [R, G, B, A] byte arrays
            .flat(1); // 1d list of bytes
                
        let imgData = new ImageData(Uint8ClampedArray.from(rgba), this.tiles.length, this.tiles.length);
    
        this.canvas.canvas.width = imgData.width;
        this.canvas.canvas.height = imgData.height;
        
        this.canvas.putImageData(imgData, 0, 0);
        
        return this.canvas.canvas.toDataURL();
    }
    renderMap(canvasWidth, canvasHeight){
        let width = Math.min(512, canvasWidth);
        this.canvas.drawImage(this.map, (canvasWidth / 2 ) - (width/2), (canvasHeight / 2) - (width/2), width, width);
    }
}