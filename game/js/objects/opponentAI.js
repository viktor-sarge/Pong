export default class OpponentAI {
    constructor(ball, paddle) {
        this.ball = ball;
        this.paddle = paddle;
    }

    update() {
      if(this.ball.y > this.paddle.y) {this.paddle.moveDown()} 
      else { this.paddle.moveUp()}
    }

}