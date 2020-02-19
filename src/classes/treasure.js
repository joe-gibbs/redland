import Spritesheet from './spritesheet.js';

export default class Treasure {
    constructor(name) {
        this.name = name;
        this.spritesheet = new Spritesheet('./assets/img/treasure.png', 136, 176);
        this.spritesheet.addAnimationSet('invisible', 0, 0);
        this.spritesheet.addAnimationSet('visible', 1, 1);
    }

    animationState() {  
        return this.spritesheet.animationSets['invisible'];
    }
}