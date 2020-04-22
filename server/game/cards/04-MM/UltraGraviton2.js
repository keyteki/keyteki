const UltraGraviton = require('./UltraGraviton.js');

class UltraGraviton2 extends UltraGraviton {
    get compositeParts() {
        return ['ultra-graviton'];
    }
}

UltraGraviton2.id = 'ultra-graviton-2';

module.exports = UltraGraviton2;
