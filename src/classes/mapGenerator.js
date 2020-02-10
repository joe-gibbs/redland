import Tile from './tile.js';
import terrain from '../terrain.js';
import buildings from '../buildings.js';

export default class MapGenerator {
    constructor() {
    }

    create2DArray(rows) {
        var arr = [];
      
        for (var i=0;i<rows;i++) {
           arr[i] = [];
        }
      
        return arr;
      }
    
      
      generate(size, simplex) {
        let data = this.create2DArray(size);

        function setTile(tile, x, y) {
            let val = (((simplex.noise2D(x / 500, y / 500)) - .7) + (((simplex.noise2D(x / 80, y / 80)) / 1.5) + ((Math.abs(simplex.noise2D(x / 20, y / 20) / 5))))) * 100;
            //Places land and water
            tile = val < 0 ? new Tile(terrain.WATER, x, y) : new Tile(terrain.LAND, x ,y);

            /**
             * Places forest
             */
            let forestVal = normalise(simplex.noise2D(x / 12, y / 12), 0, 1);
            if (forestVal < 0.9) {
                if (tile.type === terrain.LAND) {
                    tile.type = terrain.FOREST;
                    tile.currentHealth = terrain.FOREST.health;
                }
            }
        
            return tile;
        }

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let tile = data[x][y];
                data[x][y] = setTile(tile, x, y);
            }
        }   

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {

                let tile = data[i][j];
                if (tile.type === terrain.LAND &&  //Checks if there are any water tiles in a 1 tile radius, if so set to sand
                    (tile.bordering(tile.x, tile.y, data, 1)
                        .filter(e => e.type === terrain.WATER).length > 0))
                {
                    tile.type = terrain.SAND;
                }

                /**
                 * Places rocks
                 */
                let rockVal = normalise(simplex.noise2D(i / 50, j / 50), 0, 1);
                if (rockVal < 0.95 && tile.bordering(tile.x, tile.y, data, 5).filter(e => e.type === terrain.WATER).length === 0) {
                    if (tile.type !== terrain.WATER) {
                        tile.type = terrain.ROCK;
                        tile.drops = terrain.ROCK.drops;
                        tile.currentHealth = terrain.ROCK.health;
                    }
                }
            }
        }

        for (let i = 0; i < size; i++) {
            data[i][0].type = terrain.BARRIER;
            data[i][0].currentHealth = Infinity;

            data[0][i].type = terrain.BARRIER;
            data[0][i].currentHealth = Infinity;

            data[i][size - 1].type = terrain.BARRIER;
            data[i][size -1].currentHealth = Infinity;

            data[size - 1][i].type = terrain.BARRIER;
            data[size - 1][i].currentHealth = Infinity;
        }
        
        return data;
    }

    /**
     * @param {CanvasRenderingContext2D} canvas
     * @param {Tile[]} tiles 
     */
    static generateTreasureMap(canvas, tiles, treasure) {        
        const tileToType = tile => tile.type.name;
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
                    result = hexToRGBA('#3d6613');
                    break;
                case "Rock":
                    result = hexToRGBA('#757575');
                    break;
                case "Land":
                    result = hexToRGBA('#cae366');
                    break;
                case "Water":
                    result = hexToRGBA('#1c54ad');
                    break;
                default:
                    result = hexToRGBA('#cae366');
                    break;
            }
            return result;
        }

        const rgba = tiles
            .flat(1)
            .map(tileToType)  // 1d list of hex codes
            .map(tileColor)  // 1d list of [R, G, B, A] byte arrays
            .flat(1); // 1d list of bytes
                
        let imgData = new ImageData(Uint8ClampedArray.from(rgba), tiles.length, tiles.length);

        canvas.canvas.width = imgData.width;
        canvas.canvas.height = imgData.height;
        
        canvas.putImageData(imgData, 0, 0);
        
        let treasureIcon = new Image(64, 64);
        treasureIcon.src = './assets/img/marker.png';
        
        canvas.drawImage(treasureIcon, treasure.y, treasure.x);
        return (canvas.canvas.toDataURL());
    }
}