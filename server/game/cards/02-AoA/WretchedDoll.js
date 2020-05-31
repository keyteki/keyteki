const Card = require('../../Card.js');

class WretchedDoll extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardCondition: (card, context) =>
                    card.type === 'creature' &&
                    context.game.cardsInPlay.filter((card) => card.hasToken('doom')).length <= 0,
                gameAction: ability.actions.addDoomCounter()
            },
            gameAction: ability.actions.destroy((context) => ({
                // Not strictly needed but safer
                condition:
                    context.game.cardsInPlay.filter((card) => card.hasToken('doom')).length > 0,
                target: context.game.cardsInPlay.filter((card) => card.hasToken('doom'))
            }))
        });
    }
}

WretchedDoll.id = 'wretched-doll';

module.exports = WretchedDoll;
