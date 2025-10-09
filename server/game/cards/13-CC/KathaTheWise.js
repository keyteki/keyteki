const Card = require('../../Card.js');

class KathaTheWise extends Card {
    // Omni: You may play an Untamed creature from your hand.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'allow them to play one Untamed creature this turn',
            gameAction: ability.actions.untilEndOfPlayerTurn({
                effect: ability.effects.canPlayHouse({
                    house: 'untamed',
                    condition: (card) => card.type === 'creature' && card.location === 'hand'
                })
            })
        });
    }
}

KathaTheWise.id = 'katha-the-wise';

module.exports = KathaTheWise;
