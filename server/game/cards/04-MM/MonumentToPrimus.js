const Card = require('../../Card.js');

class MonumentToPrimus extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                cardCondition: (card, context) =>
                    context.player.discard.some(
                        (discardCard) => discardCard.id === 'consul-primus'
                    ) || card.controller === context.player,
                gameAction: ability.actions.removeAmber()
            },
            then: (preContext) => ({
                gameAction: ability.actions.placeAmber({
                    promptForSelect: {
                        message: '{0} uses {1} to place 1 amber on {2}',
                        messageArgs: (card) => [preContext.player, preContext.source, card],
                        cardType: 'creature',
                        cardCondition: (card, context) =>
                            card !== preContext.target &&
                            (context.player.discard.some(
                                (discardCard) => discardCard.id === 'consul-primus'
                            ) ||
                                card.controller === context.player),
                        activePromptTitle: 'Choose another creature'
                    }
                })
            })
        });
    }
}

MonumentToPrimus.id = 'monument-to-primus';

module.exports = MonumentToPrimus;
