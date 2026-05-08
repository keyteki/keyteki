const Card = require('../../Card.js');

class GoldenK1TT13 extends Card {
    // Entrench.
    // While Golden K1-TT13 is exhausted, each of its neighbors gains, "After Reap: Gain 1A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.exhausted,
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber()
            })
        });
    }
}

GoldenK1TT13.id = 'golden-k1-tt13';

module.exports = GoldenK1TT13;
