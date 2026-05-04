const Hydrogan = require('./Hydrogan.js');

class Hydrogan2 extends Hydrogan {
    // (Play only with the other half of Hydrogan.)
    // Play: Put each other creature faceup under Hydrogan.
    // After Fight/After Reap: Put a creature from under Hydrogan into play under your control.
    // Destroyed: Purge each card under Hydrogan.
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

Hydrogan2.id = 'hydrogan2';

module.exports = Hydrogan2;
