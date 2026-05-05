const MonsterZero = require('./MonsterZero.js');

class MonsterZero2 extends MonsterZero {
    // (Play only with the other half of Monster Zero.)
    // Deploy.
    // Each of Monster Zero's neighbors belongs to house Mars (instead of its other houses).
    // Play: Give Monster Zero a number of +1 power counters equal to the most powerful friendly creature's power.
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

MonsterZero2.id = 'monster-zero2';

module.exports = MonsterZero2;
