const UltraGraviton = require('./UltraGraviton.js');

class UltraGraviton2 extends UltraGraviton {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.compositeParts = ['ultra-graviton'];
    }
}

UltraGraviton2.id = 'ultra-graviton-2';

module.exports = UltraGraviton2;
