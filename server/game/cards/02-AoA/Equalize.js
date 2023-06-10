const Card = require('../../Card.js');

class Equalize extends Card {
    // Play: Redistribute the A on friendly creatures among friendly creatures. Then, redistribute the A on enemy creatures among enemy creatures.
    setupCardAbilities(ability) {
        this.play({
            effect: "redistribute {1} amber on both player's creatures",
            effectArgs: (context) => [
                context.game.creaturesInPlay.reduce((total, card) => total + card.amber, 0)
            ],
            gameAction: ability.actions.removeAmber((context) => ({
                target: context.player.creaturesInPlay,
                noGameStateCheck: true,
                all: true
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.preThenEvents
                        ? context.preThenEvents
                              .filter((event) => !event.cancelled)
                              .reduce((total, event) => total + event.amount, 0)
                        : 0,
                    action: ability.actions.placeAmber({
                        noGameStateCheck: true,
                        promptForSelect: {
                            cardType: 'creature',
                            controller: 'self'
                        }
                    })
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.removeAmber((context) => ({
                        target: context.player.opponent && context.player.opponent.creaturesInPlay,
                        noGameStateCheck: true,
                        all: true
                    })),
                    then: {
                        alwaysTriggers: true,
                        gameAction: ability.actions.sequentialForEach((context) => ({
                            num: context.preThenEvents
                                .filter((event) => !event.cancelled)
                                .reduce((total, event) => total + event.amount, 0),
                            action: ability.actions.placeAmber({
                                noGameStateCheck: true,
                                promptForSelect: {
                                    cardType: 'creature',
                                    controller: 'opponent'
                                }
                            })
                        }))
                    }
                }
            }
        });
    }
}

Equalize.id = 'equalize';

module.exports = Equalize;
