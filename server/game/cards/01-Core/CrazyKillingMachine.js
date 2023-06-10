const Card = require('../../Card.js');

class CrazyKillingMachine extends Card {
    // Action: Discard the top card of each players deck. For each of those cards, destroy a creature or artifact of that cards house, if able. If 2 cards are not destroyed as a result of this, destroy Crazy Killing Machine.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.discard((context) => ({
                target: context.game
                    .getPlayers()
                    .map((player) => player.deck[0])
                    .filter((card) => !!card)
            })),
            then: {
                alwaysTriggers: true,
                targets: {
                    c1: {
                        cardType: ['creature', 'artifact'],
                        cardCondition: (card, context) =>
                            context.preThenEvents &&
                            context.preThenEvents[0] &&
                            context.preThenEvents[0].card
                                .getHouses()
                                .some((house) => card.hasHouse(house)),
                        gameAction: ability.actions.destroy()
                    },
                    c2: {
                        dependsOn: 'c1',
                        cardType: ['creature', 'artifact'],
                        cardCondition: (card, context) =>
                            context.preThenEvents &&
                            context.preThenEvents[1] &&
                            card !== context.targets.c1 &&
                            context.preThenEvents[1].card
                                .getHouses()
                                .some((house) => card.hasHouse(house)),
                        gameAction: ability.actions.destroy()
                    }
                },
                message: '{0} uses {1} to choose and destroy {3}',
                messageArgs: (context) => [
                    context.targets.c1 || context.targets.c2
                        ? [context.targets.c1, context.targets.c2].filter((card) => !!card)
                        : 'no cards'
                ],
                then: {
                    alwaysTriggers: true,
                    condition: (context) => context.preThenEvents.length < 2,
                    message: '{0} uses {1} to destroy {1} since 2 cards were not destroyed',
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

CrazyKillingMachine.id = 'crazy-killing-machine';

module.exports = CrazyKillingMachine;
