const Chance = require('chance');

class RNG extends Chance {

    constructor(seed) {

        super(seed ? seed : 100);
    }

    generateWeighted(values, weights) {

        return this.weighted(values, weights);
    }

    generateWeightedList(values, weights, length = 0) {

        let weightedList = [];

        for(let i = 0; i < length; i++)
            weightedList.push(this.generateWeighted(values,weights));

        return weightedList;
    }
}

exports.RNG = RNG;