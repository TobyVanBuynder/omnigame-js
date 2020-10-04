const RNG = require('./../core/random').RNG;

class SymbolsGenerator {

    constructor(config) {

        this.RNG = new RNG(config.seed);
        this.symbols = [...config.symbols];
        this.symbolValues = this.symbols.map((val) => { return val.id });
        this.symbolWeights = this.symbols.map((val) => { return val.chance });
        this.numSymbolsToGenerate = config.numSymbolsToGenerate;
    }

    generateNewSymbols() {

        this.generatedSymbols = [...(this.RNG.generateWeightedList(this.symbolValues, this.symbolWeights, this.numSymbolsToGenerate))];
    }

    getGeneratedSymbols() {

        return this.generatedSymbols;
    }
}

exports.SymbolsGenerator = SymbolsGenerator;