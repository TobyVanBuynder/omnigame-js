{
    const PIXI = require('pixi.js');
    const LOADER = PIXI.Loader.shared;
    const TEXTURECACHE = PIXI.utils.TextureCache;

    const Sprite = PIXI.Sprite;
    const Text = PIXI.Text;
    const SymbolsGenerator = require('./modules/symbols-generator').SymbolsGenerator;
    const BreakableDirt = require('./modules/breakable').BreakableDirt;
    const Symbol = require('./modules/symbol').Symbol;
    const User = require('./core/user').User;

    let app = null; // to be initialized
    let game = null; // to be initialized

    (function init() {

        PIXI.utils.skipHello();

        app = new PIXI.Application();
        game = {};

        fetch("./config/config.json")
            .then(extractJson)
            .then(cacheConfig)
            .then(loadApp)
            .then(loadAndStartGame);
    })()

    function extractJson(resolve) {

        return resolve.json();
    }

    function cacheConfig(config) {

        game.config = {};
        Object.assign(game.config, config);
    }

    function loadApp() {

        app.renderer.resize(game.config.screenWidth, game.config.screenHeight);
        document.body.appendChild(app.view);
    }

    function loadAndStartGame() {

        LOADER.add(game.config.assetPath);
        LOADER.load(initGame);
    }

    function initGame() {

        setupBackground();
        setupRules();
        setupSymbols();
        setupBreakables();
        //setupForeground();
        //setupUI();
        setupUser();
    }

    function setupBackground() {

        app.stage.addChild(new Sprite(TEXTURECACHE['background.png']));
        const text = new Text("Check the console log!", { fill: "#ffffff"});
        text.anchor = { x: 0.5, y: 0.5 };
        text.position = { x: game.config.screenWidth * 0.5, y: game.config.screenHeight * 0.75 };
        app.stage.addChild(text);
    }

    function setupRules() {

        // win
        game.rules = {};
        game.rules.win = 2;
        game.rules.bigWin = 3;
    }

    function setupSymbols() {

        game.symbolsGenerator = new SymbolsGenerator({
            seed: (new Date()).getTime(),
            symbols: game.config.symbols,
            numSymbolsToGenerate: game.config.numBreakables
        });

        generateSymbols();

        game.symbolsprites = [];
        for(let i = 0; i < game.config.numBreakables; i++)
        {
            const symbol = new Symbol({
                texture: TEXTURECACHE[`symbol_${game.currentSymbols[i]}.png`],
                width: game.config.breakableSize, height: game.config.breakableSize,
                xPos: game.config.screenWidth * 0.5 - game.config.breakableSize + i * game.config.breakableSize,
                yPos: game.config.screenHeight * 0.5,
                xAnchor: 0.5, yAnchor: 0.5
            });
            const symbolData = findSymbolData(game.currentSymbols[i]);
            symbol.setData({
                texture: TEXTURECACHE[`symbol_${symbolData.id}.png`],
                win: symbolData.win,
                bigWin: symbolData.bigWin
            });
            game.symbolsprites.push(symbol);
            app.stage.addChild(symbol);
        }

        game.symbolTimer = game.config.symbolTimer;
    }

    function setupBreakables() {

        game.numBrokenDirt = 0;
        game.numBreakables = game.config.numBreakables;
        game.breakCost = game.config.breakCost;
        game.breakables = [];
        for(let i = 0; i < game.numBreakables; i++)
        {
            const breakable = new BreakableDirt({
                texture: TEXTURECACHE["dirt_solid.png"],
                width: game.config.breakableSize, height: game.config.breakableSize,
                xPos: game.config.screenWidth * 0.5 - game.config.breakableSize + i * game.config.breakableSize,
                yPos: game.config.screenHeight * 0.5,
                xAnchor: 0.5, yAnchor: 0.5,
                interactive: true, buttonMode: true,
                onBreak: onBreakAnyDirt
            });
            game.breakables.push(breakable);
            app.stage.addChild(breakable);
        }
    }

    function setupUser() {

        game.user = new User(game.config.user);
        game.user.printInfo();
    }

    function generateSymbols() {

        game.symbolsGenerator.generateNewSymbols();
        game.currentSymbols = [...game.symbolsGenerator.getGeneratedSymbols()];
    }

    function findSymbolData(symbolName) {

        let symbolData = {};

        Object.assign(symbolData, game.config.symbols[findSymbolIndex(symbolName)])

        return symbolData;
    }

    function findSymbolIndex(symbolName) {

        return game.config.symbols.findIndex((val) => { return val.id == symbolName });
    }

    function onBreakAnyDirt() {

        game.user.credits -= 10;

        if(++game.numBrokenDirt >= game.numBreakables)
            onBreakAllDirt();
    }

    function onBreakAllDirt() {

        console.log("broke all the dirt!");

        calculateWin();

        setTimeout(resetAllDirt, game.symbolTimer);
    }

    function resetAllDirt() {

        generateSymbols();

        for(let i = 0; i < game.numBreakables; i++) {

            const symbolData = findSymbolData(game.currentSymbols[i]);
            game.symbolsprites[i].setData({
                texture: TEXTURECACHE[`symbol_${symbolData.id}.png`],
                win: symbolData.win,
                bigWin: symbolData.bigWin
            });
            game.breakables[i].reset();
        }

        game.numBrokenDirt = 0;
    }

    function calculateWin() {

        let totalWin = 0;
        let winSize = 1;
        let currentSymbol = null;

        for(let i = 0; i < game.config.numBreakables-1; i++)
        {
            currentSymbol = game.currentSymbols[i];

            for(let j = i + 1; j < game.config.numBreakables; j++)
            {
                if(currentSymbol != game.currentSymbols[j])
                    continue;
                winSize++;
            }

            if(winSize > 1)
                break;
        }

        // no win
        if(winSize < game.rules.win)
            return;
        // regular win
        else if(winSize < game.rules.bigWin) {

            totalWin = findSymbolData(currentSymbol).win;
            console.log("WIN");
        }
        // big win
        else {

            totalWin = findSymbolData(currentSymbol).bigWin;
            console.log("BIGWIN");
        }

        game.user.addScore(totalWin);
        game.user.printWin(totalWin);
    }
}
