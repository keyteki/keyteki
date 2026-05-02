const Kulsha = require('./Kulsha.js');

class Kulsha2 extends Kulsha {
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

Kulsha2.id = 'kulsha2';

module.exports = Kulsha2;
