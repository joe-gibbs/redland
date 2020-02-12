export default class Spritesheet {
    /**
     * 
     * @param {String} image The image to create the spritesheet with
     * @param {Number} width The width of each sub-image
     * @param {Number} height The height of each sub-image
     */
    constructor (image, width, height) {
        this.image = new Image();
        this.width = width;
        this.height = height;
        
        this.xImages = this.image.width / width;
        this.yImages = this.image.height / height;
        this.imageCount = this.xImages * this.yImages;
        this.animationSets = {};
        this.image.src = image;
    }

    /**
     * @param {Number} index
     * @param {Number} x 
     * @param {Number} y 
     * @param {CanvasRenderingContext2D} canvas 
     */
    render(index, x, y, canvas) {        
        canvas.drawImage(this.image, this.calculateS(index)[0], this.calculateS(index)[1], this.width, this.height, x, y, this.width, this.height);
    }
    
    addAnimationSet(name, start, end) {
        this.animationSets[name] = {
                start: start, 
                end: end, 
                current: start,
                increment: function() {
                    this.current++;
                    if (this.current >= this.end) {
                        this.current = this.start;
                    }
                }
            };
    }

    calculateS(index) {
        let result = [0, 0];
        for (let i = 0; i < index; i++) {
            if (result[1] < this.xImages) {
                result[1] += 1;
            }
            else {
                result[0] += 1;
                result[1] = 0;
            }
        }
        result[0] *= this.width;
        result[1] *= this.height;
        return result;
    }
}