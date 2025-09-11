const CadetAllison = require('./CadetAllison.js');

class CadetAllison2 extends CadetAllison {
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

CadetAllison2.id = 'cadet-allison2';

module.exports = CadetAllison2;
