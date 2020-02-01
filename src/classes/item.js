export default class Item {
    constructor(name, image) {
        this.image = new Image();
        this.image.src = image;
        this.name = name;
    }
}