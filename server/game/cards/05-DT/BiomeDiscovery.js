const Card = require('../../Card.js');

class BiomeDiscovery extends Card {
    // (T) Play: If the tide is high, you may look at the top 2 cards of your deck and discard 1 of them. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.discard((context) => ({
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose a card to discard',
                        message: '{0} uses {1} to discard {2}',
                        messageArgs: (cards) => [context.player, context.source, cards[0]],
                        // this is a hack to remove all cards from being picked
                        // when the tide is not high. causes this action to be a no-op
                        // this was done because ability.actions.conditional and '
                        // promptWithHandlerMenu were not playing nice together
                        cards:
                            context.player.deck.length > 0 && context.player.isTideHigh()
                                ? context.player.deck.slice(0, 2)
                                : []
                    }
                })),
                ability.actions.conditional({
                    condition: (context) => context.player.isTideHigh(),
                    falseGameAction: ability.actions.raiseTide()
                })
            ]
        });
    }
}

BiomeDiscovery.id = 'biome-discovery';

module.exports = BiomeDiscovery;
