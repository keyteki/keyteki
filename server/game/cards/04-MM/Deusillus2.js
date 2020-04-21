const Deusillus = require('./Deusillus.js');

class Deusillus2 extends Deusillus {
    constructor(owner, cardData) {
        cardData.power = 20; // TODO hack
        super(owner, cardData);
    }

    get compositeParts() {
        return ['deusillus'];
    }
}

Deusillus2.id = 'deusillus-2';

module.exports = Deusillus2;
