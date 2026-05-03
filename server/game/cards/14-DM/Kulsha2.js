const Kulsha = require('./Kulsha.js');

class Kulsha2 extends Kulsha {
    // (Play only with the other half of Kulsha.)
    // Your opponent's keys cost +2A for each forged key they have.
    // After Fight/After Reap: Exhaust up to 3 creatures.
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

Kulsha2.id = 'kulsha2';

module.exports = Kulsha2;
