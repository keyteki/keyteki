const Card = require('../../Card.js');

class Physaloha extends Card {
    // Damaged creatures do not ready during the "ready cards" step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            type: 'creature',
            match: (card) => !!card.tokens.damage,
            effect: ability.effects.doesNotReady()
        });
    }
}

Physaloha.id = 'physaloha';

module.exports = Physaloha;
