const Card = require('../../Card.js');

class GreenAeronaut extends Card {
    // Action: A friendly Nautilixian gains Splash-attack 3 for the
    // remainder of the turn.
    setupCardAbilities(ability) {
        this.action({
            effect: 'a friendly Nautilixian gains Splash-attack 3 for the remainder of the turn',
            target: {
                controller: 'self',
                cardCondition: (card) => card.name === 'Nautilixian',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfRound',
                    effect: ability.effects.addKeyword({ 'splash-attack': 3 })
                })
            }
        });
    }
}

GreenAeronaut.id = 'green-aeronaut';

module.exports = GreenAeronaut;
