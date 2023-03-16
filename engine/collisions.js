export default class Collisions {
    // The shape string is hardcoded in a subclass that objects extends.
    check(a,b) {
        if(a.shape === b.shape) {
            if(a.shape === "rectangle") {
                // Both are rectangles
                return this.rectangles(a,b)
            } else {
                // Both being circles is assumed
                return this.circles(a,b)
            }
        } else {
            // A circle and a rect is assumed
            if(a.shape === "circle") {
                return this.circleRect(a,b);
            } else {
                return this.circleRect(b,a);
            }
        }
    }

    circleRect(circle,rect) {
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        return distanceSquared < circle.radius * circle.radius;
    }

    rectangles(rect1, rect2) {
        return !(
            rect1.x + rect1.width < rect2.x ||
            rect2.x + rect2.width < rect1.x ||
            rect1.y + rect1.height < rect2.y ||
            rect2.y + rect2.height < rect1.y
            );
    }

    circles(circle1, circle2) {
        const distanceSquared =
        (circle1.x - circle2.x) * (circle1.x - circle2.x) +
        (circle1.y - circle2.y) * (circle1.y - circle2.y);
        return distanceSquared < (circle1.radius + circle2.radius) * (circle1.radius + circle2.radius);
    }
}