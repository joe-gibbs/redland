export default class Boat{
    constructor(x, y, img){
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.image = new Image();
        this.image.src = img;
        this.health = 0; //as it gets built the health rises. 
        
    }

}