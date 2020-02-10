import Spritesheet from './spritesheet.js';

export default class Treasure {
    constructor(name) {
        this.name = name;
        this.spritesheet = new Spritesheet('./assets/img/treasure.png', 64, 64);
        this.spritesheet.addAnimationSet('invisible', 0, 0);
        this.spritesheet.addAnimationSet('visible', 1, 1);

    }

    animationState() {  
        
        //if shovelled  return this.spritesheet.animationSets['visible'];
        return this.spritesheet.animationSets['invisible'];
    }
}