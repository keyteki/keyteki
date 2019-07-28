const Card = require('../../Card.js');

class Equalize extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'redistribute the amber on both player\'s creatures',
            gameAction: ability.actions.removeAmber(context => ({
                target: context.game.creaturesInPlay,
                noGameStateCheck: true,
                all: true
            })),
            then: {
                gameAction: [
                    ability.actions.sequentialForEach(context => ({
                        num: context.preThenEvents.filter(event => !event.cancelled && event.card.controller === context.player.opponent && event.amount > 0).reduce((total, event) => total + event.amount, 0),
                        action: ability.actions.placeAmber({
                            noGameStateCheck: true,
                            promptForSelect: {
                                cardType: 'creature',
                                controller: 'opponent'
                            }
                        })
                    })),
                    ability.actions.sequentialForEach(context => ({
                        num: context.preThenEvents.filter(event => !event.cancelled && event.card.controller === context.player && event.amount > 0).reduce((total, event) => total + event.amount, 0),
                        action: ability.actions.placeAmber({
                            noGameStateCheck: true,
                            promptForSelect: {
                                cardType: 'creature',
                                controller: 'self'
                            }
                        })
                    }))
                ]
            }
        });
    }
}

Equalize.id = 'equalize';

module.exports = Equalize;
