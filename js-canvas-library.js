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

// Keyboard listener
const KEY_DOWN = 0;
const KEY_UP = 1;

class KeyboardListener {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.keys = [];
    }
    init() {
        let setKey = this.#setKey.bind(this);
        document.body.addEventListener("keydown", function(event) {
            setKey(event.key.toUpperCase(), true);
        });
        document.body.addEventListener("keyup", function(event) {
            setKey(event.key.toUpperCase(), false);
        });
    }
    addListener(listenerType, action) {
        let listenerName = null;

        if(listenerType == KEY_DOWN) listenerName = "keydown";
        if(listenerType == KEY_UP) listenerName = "keyup";

        if(listenerName != null) {
            document.body.addEventListener(listenerName, function() {
                action();
            });
        }
    }
    isPressed(key) {
        let keyBoolean = this.keys[key];

        if(!keyBoolean) return false;
        return keyBoolean;
    }
    #setKey(key, value) {
        this.keys[key] = value;
    }
}

// Mouse listener
const MOUSE_DOWN = 0;
const MOUSE_UP = 1;
const MOUSE_CLICKED = 2;

const MOUSE_MOVE = 3;
const MOUSE_DRAG = 4;

class MouseListener {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.clicked = false;
    }
    init() {
        let setMouseClicked = this.#setMouseClicked.bind(this);
        this.gameEngine.canvas.addEventListener("mousedown", function() {
            setMouseClicked(true);
        });
        this.gameEngine.canvas.addEventListener("mouseup", function() {
            setMouseClicked(false);
        });
    }
    addListener(listenerType, action) {
        let listenerName = null;

        if(listenerType == MOUSE_DOWN) listenerName = "mousedown";
        if(listenerType == MOUSE_UP) listenerName = "mouseup";
        if(listenerType == MOUSE_CLICKED) listenerName = "click";
        if(listenerType == MOUSE_MOVE) listenerName = "mousemove";
        
        let setMouseData = this.#setMouseData.bind(this);
        if(listenerName != null) {

            this.gameEngine.canvas.addEventListener(listenerName, function(event) {
                setMouseData(event);
                action();
            });
        }

        let getMouseClicked = this.#getMouseClicked.bind(this);
        if(listenerType == MOUSE_DRAG) {
            this.gameEngine.canvas.addEventListener("mousemove", function(event) {
                setMouseData(event);
                if(getMouseClicked()) {
                    action();
                }
            });
        }
    }
    #setMouseData(jsMouseEvent) {
        this.mouseX = jsMouseEvent.clientX - this.gameEngine.canvas.offsetLeft;
        this.mouseY = jsMouseEvent.clientY - this.gameEngine.canvas.offsetTop;
        this.button = jsMouseEvent.button;
    }
    #setMouseClicked(clicked) {
        this.clicked = clicked;
    }
    #getMouseClicked() {
        return this.clicked;
    }
}