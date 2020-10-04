function setupSprite(spriteObj, config) {

    spriteObj.width = config.width;
    spriteObj.height = config.height;
    spriteObj.position.x = config.xPos;
    spriteObj.position.y = config.yPos;
    spriteObj.anchor.x = config.xAnchor;
    spriteObj.anchor.y = config.yAnchor;
    spriteObj.interactive = config.interactive;
    spriteObj.buttonMode = config.buttonMode;
}

exports.SpriteHelper = setupSprite;