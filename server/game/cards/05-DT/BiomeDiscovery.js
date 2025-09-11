const Card = require('../../Card.js');

class BiomeDiscovery extends Card {
    // (T) Play: If the tide is high, you may look at the top 2 cards of your deck and discard 1 of them. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => !context.player.isTideHigh(),
                trueGameAction: ability.actions.raiseTide()
            }),
            effect: '{1}',
            effectArgs: (context) =>
                !context.player.isTideHigh()
                    ? 'raise the tide'
                    : 'conditionally look at top 2 deck cards',
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    (!context.preThenEvent || context.preThenEvent.length === 0) &&
                    context.player.deck.length > 0,
                may: 'look at the top 2 deck cards',
                gameAction: ability.actions.discard((context) => ({
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose a card to discard',
                        messageArgs: (cards) => [context.player, context.source, cards[0]],
                        cards: context.player.deck.slice(0, 2)
                    }
                }))
            }
        });
    }
}

BiomeDiscovery.id = 'biome-discovery';

module.exports = BiomeDiscovery;
