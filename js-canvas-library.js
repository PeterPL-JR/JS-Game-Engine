class GameEngine {
    constructor() {
        this.clearColor = "black";
    }
    init(canvasWidth, canvasHeight, container) {
        this.width = canvasWidth;
        this.height = canvasHeight;

        this.container = container
        this.#initCanvas();
    }
    start(update, render) {
        this.userUpdate = update;
        this.userRender = render;
        this.#update();
    }

    #render() {
        this.userRender();
    }
    #clear() {
        this.ctx.fillStyle = this.clearColor;
        this.ctx.fillRect(0, 0, this.width, this.height);        
    }
    #update() {
        requestAnimationFrame(this.#update.bind(this));
        this.userUpdate();

        this.#clear();
        this.#render();
    }

    #initCanvas() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
    }

    drawImage(image, x, y) {
        image.draw(this.ctx, x, y);
    }
    drawJSImage(image, x, y, width=undefined, height=undefined) {
        if(width && height) {
            this.ctx.drawImage(image, x, y, width, height);
        } else {
            this.ctx.drawImage(image, x, y);
        }
    }
}

class ImageAsset {
    constructor(source, width, height, sx, sy, swidth, sheight) {
        this.source = source;

        this.width = width;
        this.height = height;

        this.sx = sx;
        this.sy = sy;

        this.swidth = swidth;
        this.sheight = sheight;

        this.init();
    }
    init() {
        if((typeof this.source) == "string") {
            this.image = document.createElement("img");
            this.image.onload = this.ready.bind(this);
            this.image.src = this.source;
        }
        if((typeof this.source) == "object") {
            this.image = this.source;
            this.image.onload = this.ready.bind(this);
        }
    }
    ready() {
        if(this.sx == undefined || this.sy == undefined || !this.swidth || !this.sheight) {
            this.sx = 0;
            this.sy = 0;

            this.swidth = this.image.width;
            this.sheight = this.image.height;
        }
    }
    draw(ctx, x, y) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, x, y, this.width, this.height);
    }
    drawRotated(ctx, x, y, angle) {
        let translateX = x + this.width / 2;
        let translateY = y + this.height / 2;

        ctx.translate(translateX, translateY);
        ctx.rotate(angle);
        ctx.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, -this.width / 2, -this.height / 2, this.width, this.height);

        ctx.rotate(-angle);
        ctx.translate(-translateX, -translateY);
    }
}

class JSImageAsset extends Image {
    constructor(path) {
        super();
        this.src = path;
    }
}