import Pawn from "./pawn.js";
import Spritesheet from "../spritesheet.js";

export default class Wolf extends Pawn {
    constructor(map, x, y) {
        super(map, x, y, new Spritesheet('./assets/img/wolf.png', 64, 64), 300, 10, true);
    }
}