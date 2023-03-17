import { anglePointingRight } from "../helpers/helperFunctions.js";
export default class OpponentAI {
    constructor(ball, paddle, canvas) {
        this.ball = ball;
        this.paddle = paddle;
        this.canvas = canvas;
    }

    update() {
        const middleOfCanvas = this.canvas.height / 2;
        const distanceFromMiddle = Math.abs(this.paddle.y - middleOfCanvas);
    
        if (anglePointingRight(this.ball.angle) || this.ball.x > this.paddle.x - 100) {
            if (this.ball.y > this.paddle.y) {
                this.paddle.moveDown();
            } else {
                this.paddle.moveUp();
            }
        } else {
            if (distanceFromMiddle > 50) {
                if (middleOfCanvas > this.paddle.y) {
                    this.paddle.moveDown();
                } else {
                    this.paddle.moveUp();
                }
            }
        }
    }

}