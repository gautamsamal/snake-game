import Background from './background.js';
import { controls } from './constants.js';

export default class Snake {
    constructor(context, { background = 'grass', color = '#188038', grid = false, padding = 50 } = {}) {
        if (!(context instanceof CanvasRenderingContext2D)) {
            throw new Error('Context must of CanvasRenderingContext2D type');
        }
        this.context = context;
        this.background = background;
        this.color = color;
        this.grid = grid;
        this.canvasWidth = context.canvas.width;
        this.canvasHeight = context.canvas.height;
        this.bitGap = 10;
        this.currentDir = controls.RIGHT;
        this.speed = 1;
        this.dirUserEvent = null;

        this.x = this.y = this.padding = padding;
        this.width = this.canvasWidth - (padding * 2);
        this.height = this.canvasHeight - (padding * 2);

        if ((this.width / 2) % this.bitGap !== 0) {
            throw new Error(`Canvas width should be multiple even number of ${this.bitGap}s`);
        }
        if ((this.height / 2) % this.bitGap !== 0) {
            throw new Error(`Canvas height should be multiple even number of ${this.bitGap}s`);
        }

        this.bgRenderer = new Background(context, { padding });
        this.snakeBits = [
            { x: this.canvasWidth / 2 - (this.bitGap * 2), y: this.canvasHeight / 2, height: this.bitGap, width: this.bitGap },
            { x: this.canvasWidth / 2 - (this.bitGap), y: this.canvasHeight / 2, height: this.bitGap, width: this.bitGap },
            { x: this.canvasWidth / 2, y: this.canvasHeight / 2, height: this.bitGap, width: this.bitGap },
            { x: this.canvasWidth / 2 + (this.bitGap), y: this.canvasHeight / 2, height: this.bitGap, width: this.bitGap },
            { x: this.canvasWidth / 2 + (this.bitGap * 2), y: this.canvasHeight / 2, height: this.bitGap, width: this.bitGap }
        ];
    }

    drawBackground() {
        this.bgRenderer.setType(this.background);
        this.color = this.bgRenderer.getComplimentColor();
        this.bgRenderer.draw();
    }

    drawGrid() {
        if (!this.grid) {
            return;
        }
        for (let x = this.x; x <= this.x + this.width; x += this.bitGap) {
            this.context.moveTo(x, this.x);
            this.context.lineTo(x, this.y + this.height);
        }

        for (let y = this.y; y <= this.y + this.height; y += this.bitGap) {
            this.context.moveTo(this.y, y);
            this.context.lineTo(this.x + this.width, y);
        }
        this.context.strokeStyle = "#e2e6e7";
        this.context.stroke();
    }

    drawSnake() {
        this.context.clearRect(this.x, this.y, this.width, this.height);
        this.drawBackground();
        this.drawGrid();
        this.context.fillStyle = this.color;
        this.snakeBits.forEach(bit => {
            if (bit.x + this.bitGap > this.width + this.x) {
                bit.x = this.x;
            }
            if (bit.x < this.x) {
                bit.x = this.width + this.x - this.bitGap;
            }
            if (bit.y + this.bitGap > this.height + this.y) {
                bit.y = this.y;
            }
            if (bit.y < this.y) {
                bit.y = this.height + this.y - this.bitGap;
            }
            this.context.fillRect(bit.x, bit.y, bit.width, bit.height);
        });
    }

    advanceSnake() {
        this.drawSnake();
        // dodo: make use of worker.
        setInterval(() => {
            if (this.dirUserEvent) {
                this.currentDir = this.dirUserEvent
            }
            const nextBit = this._getDirBit(this.currentDir);
            if (nextBit) {
                this.snakeBits.push(nextBit);
                this.snakeBits.shift();
            }
            this.drawSnake();
        }, 500 / this.speed);
    }

    changeDirection(dir) {
        const { LEFT, RIGHT, UP, DOWN } = controls;
        if ([LEFT, RIGHT].includes(dir) && [LEFT, RIGHT].includes(this.currentDir)) {
            return;
        }
        if ([UP, DOWN].includes(dir) && [UP, DOWN].includes(this.currentDir)) {
            return;
        }

        if ([LEFT, RIGHT, UP, DOWN].includes(dir)) {
            this.dirUserEvent = dir;
        }
    }

    _getDirBit(dir) {
        const head = this.snakeBits[this.snakeBits.length - 1];
        switch (dir) {
            case controls.UP:
                return { x: head.x, y: head.y - this.bitGap, height: head.height, width: head.width };
            case controls.DOWN:
                return { x: head.x, y: head.y + this.bitGap, height: head.height, width: head.width };
            case controls.LEFT:
                return { x: head.x - this.bitGap, y: head.y, height: head.height, width: head.width };
            case controls.RIGHT:
                return { x: head.x + this.bitGap, y: head.y, height: head.height, width: head.width };
            default:
                console.warn(`Unsupported move - ${dir}`);
                return null;
        }
    }
}
