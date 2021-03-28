const Card = require('../../Card.js');

class GiantSloth extends Card {
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
