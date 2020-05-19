const backgroundLib = {
    grass: {
        src: 'assets/img/grass_bg.jpg',
        complimentColor: '#ca7e06c4'
    },
    ice: {
        src: 'assets/img/crystal_ice.jpg',
        complimentColor: '#3b342ebf'
    }
};

export default class Background {
    constructor(context, { padding = 0 }) {
        if (!(context instanceof CanvasRenderingContext2D)) {
            throw new Error('Context must of CanvasRenderingContext2D type.');
        }
        this.context = context;
        this.padding = padding;
        this.width = context.canvas.width;
        this.height = context.canvas.height;
        this.cacheImg();
    }

    cacheImg() {
        Object.keys(backgroundLib).forEach(type => {
            if (backgroundLib[type].loaded || backgroundLib[type].elem) {
                return;
            }
            const img = new Image();
            img.src = backgroundLib[type].src;
            img.onload = function () {
                this.loaded = true;
            }.bind(backgroundLib[type]);
            backgroundLib[type].elem = img;
        });
    }

    setType(type) {
        this.type = type;
    }

    getComplimentColor() {
        if (!this.type) {
            throw new Error('Type must be set before getting a compliment color');
        }
        return (backgroundLib[this.type] && backgroundLib[this.type].complimentColor) ?
            backgroundLib[this.type].complimentColor : null;
    }

    draw() {
        if (!this.type) {
            throw new Error('Type must be set before drawing');
        }
        if (!backgroundLib[this.type]) {
            console.warn(`Background style - ${this.type} is not supported`);
        }

        const pattern = this.context.createPattern(backgroundLib[this.type].elem, 'repeat');
        this.context.fillStyle = pattern;
        this.context.fillRect(this.padding, this.padding, this.width - (this.padding * 2), this.height - (this.padding * 2));
    }
}
