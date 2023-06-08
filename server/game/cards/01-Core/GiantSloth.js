const Card = require('../../Card.js');

class GiantSloth extends Card {
    // You cannot use this card unless you have discarded an Untamed card from your hand this turn.
    // Action: Gain 3<A>.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.game.cardsDiscarded.some((card) => card.hasHouse('untamed')),
            effect: ability.effects.cardCannot('use')
        });

        this.action({
            gameAction: ability.actions.gainAmber({ amount: 3 })
        });
    }
}

GiantSloth.id = 'giant-sloth';

module.exports = GiantSloth;
