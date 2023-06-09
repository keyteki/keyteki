const Card = require('../../Card.js');

class GeneralOrder24 extends Card {
    // At the start of each players turn, they must choose a creature they control and destroy each creature of the chosen creatures house. If that player has no creatures in play, destroy General Order 24 instead.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: () => true
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.activePlayer.creaturesInPlay.length === 0 ? context.source : []
            })),
            target: {
                activePromptTitle: 'Choose a creature to destroy',
                cardType: 'creature',
                cardCondition: (card, context) =>
                    context.game.activePlayer.creaturesInPlay.includes(card),
                gameAction: ability.actions.destroy((context) => ({
                    target:
                        context.target &&
                        context.game.creaturesInPlay.filter((creature) =>
                            context.target.getHouses().some((house) => creature.hasHouse(house))
                        )
                }))
            }
        });
    }
}

GeneralOrder24.id = 'general-order-24';

module.exports = GeneralOrder24;
