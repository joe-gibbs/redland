import Tile from './tile.js';
import terrain from '../terrain.js';
import buildings from '../buildings.js';

function normalise(val, max, min) { return (val - min) / (max - min); }    

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
    
      
      generate(size, simplex, progressBar) {
        progressBar.value += 15;
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
        progressBar.value += 25;

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

                /**
                 * Places tall grass
                 */
                let tallGrassVal = normalise(simplex.noise2D(i / 10, j / 10), 0, 1);
                
                if (tallGrassVal > 1.4) {
                    if (tile.type === terrain.LAND) {
                        tile.type = terrain.TALL_GRASS;
                        tile.drops = terrain.TALL_GRASS.drops;
                        tile.currentHealth = terrain.TALL_GRASS.health;
                    }
                }
            }
        }
        progressBar.value += 50;

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
        progressBar.value += 10;
        return data;
    }
}