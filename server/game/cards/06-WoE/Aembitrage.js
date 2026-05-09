const Card = require('../../Card.js');

class Ambitrage extends Card {
    //Your keys cost +1A. During your "draw cards" step, refill your hand to 1 additional card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyKeyCost(() => 1)
        });
        this.persistentEffect({
            effect: ability.effects.modifyHandSize(() => 1)
        });
    }
}

Ambitrage.id = 'æmbitrage';

module.exports = Ambitrage;
