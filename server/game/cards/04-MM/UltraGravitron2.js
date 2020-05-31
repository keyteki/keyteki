const UltraGravitron = require('./UltraGravitron.js');

class UltraGravitron2 extends UltraGravitron {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.compositeParts = ['ultra-gravitron'];
    }
}

UltraGravitron2.id = 'ultra-gravitron2';

module.exports = UltraGravitron2;
