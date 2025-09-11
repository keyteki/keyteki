const TitanicBumblebird = require('./TitanicBumblebird.js');

class TitanicBumblebird2 extends TitanicBumblebird {
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

TitanicBumblebird2.id = 'titanic-bumblebird2';

module.exports = TitanicBumblebird2;
