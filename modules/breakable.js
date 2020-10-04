const RectangleButton = require('./../core/button').RectangleButton;
const PIXI = require('pixi.js');
const TEXTURECACHE = PIXI.utils.TextureCache;

class BreakableDirt extends RectangleButton {

    constructor(config) {

        super(config);

        this.currentStateTextureIndex = 0;
        this.stateTextures = [
            TEXTURECACHE["dirt_solid.png"],
            TEXTURECACHE["dirt_cracked.png"],
            TEXTURECACHE["dirt_broken.png"],
            TEXTURECACHE["dirt_symbol.png"]
        ];

        this.texture = this.stateTextures[this.currentStateTextureIndex];

        this.on("pointerdown", this.nextState);
        this.onBreak = config.onBreak;
    }

    nextState() {

        this.currentStateTextureIndex++;
        this.swapNextTexture();
        if(this.currentStateTextureIndex >= this.stateTextures.length-1) {

            this.interactive = false;
            this.buttonMode = false;
            this.onBreak();
        }
    }

    swapNextTexture() {

        this.texture = this.stateTextures[this.currentStateTextureIndex];
    }

    reset() {

        this.currentStateTextureIndex = 0;
        this.texture = this.stateTextures[this.currentStateTextureIndex];
        this.interactive = true;
        this.buttonMode = true;
    }
}

exports.BreakableDirt = BreakableDirt;