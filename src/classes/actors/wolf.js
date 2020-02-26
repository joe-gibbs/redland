import Pawn from "./pawn";
import Spritesheet from "../spritesheet";

export default class Wolf extends Pawn {
    constructor(x, y) {
        super(x, y, new Spritesheet(), 300, 10, true);
    }
}