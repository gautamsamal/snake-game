import { controls } from './constants.js';

export default class Snake {
    constructor(context, { color = '#188038', grid = true } = {}) {
        if (!(context instanceof CanvasRenderingContext2D)) {
            throw new Error('Context must of CanvasRenderingContext2D type.');
        }
        this.context = context;
        this.color = color;
        this.grid = grid;
        this.width = context.canvas.width;
        this.height = context.canvas.height;

        this.bitGap = 10;
        this.currentDir = controls.RIGHT;
        this.speed = 1;
        this.dirChangePending = false;

        if ((this.width / 2) % 10 !== 0) {
            throw new Error('Canvas width should be multiple even number of 10s');
        }
        if ((this.height / 2) % 10 !== 0) {
            throw new Error('Canvas height should be multiple even number of 10s');
        }

        this.snakeBits = [
            { x: this.width / 2 - 20, y: this.height / 2, height: 10, width: 10 },
            { x: this.width / 2 - 10, y: this.height / 2, height: 10, width: 10 },
            { x: this.width / 2, y: this.height / 2, height: 10, width: 10 },
            { x: this.width / 2 + 10, y: this.height / 2, height: 10, width: 10 },
            { x: this.width / 2 + 20, y: this.height / 2, height: 10, width: 10 }
        ];
    }

    drawGrid() {
        if (!this.grid) {
            return;
        }
        for (let x = this.bitGap; x < this.width; x += this.bitGap) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.height);
        }

        for (let y = this.bitGap; y < this.height; y += this.bitGap) {
            this.context.moveTo(0, y);
            this.context.lineTo(this.width, y);
        }
        this.context.strokeStyle = "#e2e6e7";
        this.context.stroke();
    }

    drawSnake() {
        this.dirChangePending = false;
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.context.fillStyle = this.color;
        this.snakeBits.forEach(bit => {
            if (bit.x > this.width) {
                bit.x = 0;
            }
            if (bit.x < 0) {
                bit.x = this.width - this.bitGap;
            }
            if (bit.y > this.height) {
                bit.y = 0;
            }
            if (bit.y < 0) {
                bit.y = this.height - this.bitGap;
            }
            this.context.fillRect(bit.x, bit.y, bit.width, bit.height);
        });
    }

    advanceSnake() {
        this.drawSnake();
        // dodo: make use of worker.
        setInterval(() => {
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

        if (this.dirChangePending) {
            return;
        }

        if ([LEFT, RIGHT, UP, DOWN].includes(dir)) {
            this.currentDir = dir;
            this.dirChangePending = true;
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
