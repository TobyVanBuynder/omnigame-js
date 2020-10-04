const PIXI = require('pixi.js');
const SpriteHelper = require('./../core/spritehelper').SpriteHelper;

const Sprite = PIXI.Sprite;
const Rectangle = PIXI.Rectangle;
const Circle = PIXI.Circle;

class RectangleButton extends Sprite {

    constructor(config) {

        super(config.texture);

        this.hitArea = new Rectangle(-this.width * 0.5,
                                     -this.height * 0.5,
                                      this.width,
                                      this.height);

        SpriteHelper(this, config);
    }
}

class RoundButton extends Sprite {

    constructor(config) {

        super(config.texture);

        this.hitArea = new Circle(-this.width * 0.5,
                                     -this.height * 0.5,
                                      this.radius);

        SpriteHelper(this, config);
    }
}

exports.RectangleButton = RectangleButton;
exports.RoundButton = RoundButton;