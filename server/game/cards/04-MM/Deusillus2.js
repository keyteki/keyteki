const Deusillus = require('./Deusillus.js');

class Deusillus2 extends Deusillus {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.compositeParts = ['deusillus'];
    }
}

Deusillus2.id = 'deusillus2';

module.exports = Deusillus2;
