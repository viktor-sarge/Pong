export default class Physics {
    constructor(friction) {
      this.friction = friction;
    }
  
    applyFriction(velocity) {
      if (velocity > 0) {
        velocity -= this.friction;
        if (velocity < 0) {
          velocity = 0;
        }
      } else if (velocity < 0) {
        velocity += this.friction;
        if (velocity > 0) {
          velocity = 0;
        }
      }
      return velocity;
    }
  }