import Card from '../../Card.js';

class MonumentToPrimus extends Card {
    // Action: Move 1A from a friendly creature to another friendly creature. If Consul Primus is in your discard pile, move 1A from a creature to another creature instead.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) =>
                (context.player.discard.some((discardCard) => discardCard.id === 'consul-primus')
                    ? context.game.creaturesInPlay
                    : context.player.creaturesInPlay
                ).length > 1,
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

export default MonumentToPrimus;
