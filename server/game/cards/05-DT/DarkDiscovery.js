const Card = require('../../Card.js');

class DarkDiscovery extends Card {
    // Play: Name 2 cards. Discard the bottom 2 cards of your opponent's deck. If they are the named cards, purge Dark Discovery and forge a key at no cost.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                firstCard: {
                    mode: 'card-name'
                },
                secondCard: {
                    mode: 'card-name'
                }
            },
            gameAction: ability.actions.discard((preThenContext) => ({
                target: preThenContext.player.opponent.deck.slice(
                    Math.max(preThenContext.player.opponent.deck.length - 2, 0)
                )
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) => {
                    let discardedCardNames = context.preThenEvents
                        .filter((event) => event.name === 'onCardDiscarded')
                        .map((event) => event.card.name);

                    if (discardedCardNames.length != 2) {
                        return false;
                    }

                    if (
                        discardedCardNames[0] === preThenContext.targets.firstCard &&
                        discardedCardNames[1] === preThenContext.targets.secondCard
                    ) {
                        return true;
                    } else if (
                        discardedCardNames[1] === preThenContext.targets.firstCard &&
                        discardedCardNames[0] === preThenContext.targets.secondCard
                    ) {
                        return true;
                    }

                    return false;
                },
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
