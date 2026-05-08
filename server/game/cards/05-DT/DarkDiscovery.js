const Card = require('../../Card.js');

class DarkDiscovery extends Card {
    // Play: Name 2 cards. Discard the bottom 2 cards of your opponent's deck. If they are the named cards, purge Dark Discovery and forge a key at no cost.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            targets: {
                firstCard: {
                    mode: 'card-name',
                    activePromptTitle: 'Name the first card'
                },
                secondCard: {
                    mode: 'card-name',
                    activePromptTitle: 'Name the second card'
                }
            },
            effect: 'name {1} and {2}',
            effectArgs: (context) => [context.targets.firstCard, context.targets.secondCard],
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(context.player.opponent.deck.length - 2)
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) => {
                    let discardedCardNames = context.preThenEvents.map((event) => event.card.name);

                    if (discardedCardNames.length != 2) {
                        return false;
                    }

                    return (
                        (discardedCardNames[0] === preThenContext.targets.firstCard &&
                            discardedCardNames[1] === preThenContext.targets.secondCard) ||
                        (discardedCardNames[1] === preThenContext.targets.firstCard &&
                            discardedCardNames[0] === preThenContext.targets.secondCard)
                    );
                },
                message: '{0} purges {1} and forges a key at no cost',
                gameAction: [
                    ability.actions.forgeKey({
                        atNoCost: true
                    }),
                    ability.actions.purge()
                ]
            })
        });
    }
}

DarkDiscovery.id = 'dark-discovery';

module.exports = DarkDiscovery;
