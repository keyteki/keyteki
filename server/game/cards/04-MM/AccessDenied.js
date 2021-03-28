const Card = require('../../Card.js');

class AccessDenied extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('reap')
        });
    }
}

AccessDenied.id = 'access-denied';

module.exports = AccessDenied;
