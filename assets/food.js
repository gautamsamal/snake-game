export default class Food {
    constructor(context, x, y, radius) {
        if (!(context instanceof CanvasRenderingContext2D)) {
            throw new Error('Context must of CanvasRenderingContext2D type.');
        }
        this.context = context;
        // Transform x & y as center.
        this.x = x + radius;
        this.y = y + radius;
        this.radius = radius;
        this.active = true;
    }

    setInActive() {
        this.active = false;
    }

    draw() {
        if (!this.active) {
            return;
        }
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'red';
        this.context.fill();
    }
}
