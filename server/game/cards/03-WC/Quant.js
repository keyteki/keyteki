const Card = require('../../Card.js');

class Quant extends Card {
    // Reap: You may play one non-Logos action card this turn.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'allow them to play one non-Logos action card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayNonHouse({
                    house: 'logos',
                    condition: (card) => card.type === 'action'
                })
            })
        });
    }
}

Quant.id = 'quant';

module.exports = Quant;
