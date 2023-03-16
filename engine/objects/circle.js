import Entity from "./baseEntity.js";

export default class Circle extends Entity {
    constructor(x,y, radius) {
        super(x,y)
        this.shape = "circle";
        this.radius = radius;
    }
}