const PIXI = require('pixi.js');
const SpriteHelper = require('./../core/spritehelper').SpriteHelper;

const Sprite = PIXI.Sprite;

class Symbol extends Sprite {

    constructor(config) {

        super(config.texture);

        SpriteHelper(this, config);
    }

    setData(data) {

        this.texture = data.texture;
        this.win = data.win;
        this.bigWin = data.bigWin;
    }
}

exports.Symbol = Symbol;