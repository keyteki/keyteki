const Card = require('../../Card.js');

class Equalize extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'redistribute the amber on both player\'s creatures',
            gameAction: ability.actions.removeAmber(context => ({
                target: context.player.creaturesInPlay,
                noGameStateCheck: true,
                all: true
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequentialForEach(context => ({
                    num: context.preThenEvents ? context.preThenEvents.filter(event => !event.cancelled).reduce((total, event) => total + event.amount, 0) : 0,
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
                    gameAction: ability.actions.removeAmber(context => ({
                        target: context.player.opponent && context.player.opponent.creaturesInPlay,
                        noGameStateCheck: true,
                        all: true
                    })),
                    then: {
                        gameAction: ability.actions.sequentialForEach(context => ({
                            num: context.preThenEvents.filter(event => !event.cancelled).reduce((total, event) => total + event.amount, 0),
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
