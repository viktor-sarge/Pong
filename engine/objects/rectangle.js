import Entity from "./baseEntity.js";

export default class Rectangle extends Entity {
    constructor(x,y, width, height) {
        super(x,y)
        this.shape = "rectangle";
        this.width = width;
        this.height = height;
    }
}