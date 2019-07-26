const Card = require('../../Card.js');

class Equalize extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.returnAmber(context => ({
                target: context.game.creaturesInPlay.filter(card => card.type === 'creature'),
                all: true
            })),
            then: {
                gameAction: [
                    ability.actions.sequentialForEach(context => ({
                        num: context.preThenEvents.filter(event => !event.cancelled && event.recipient === context.player && event.amount > 0).reduce((total, event) => total + event.amount, 0),
                        action: ability.actions.capture(context => {
                            if(!context.player.opponent) {
                                return { target: [] };
                            }

                            return {
                                promptForSelect: {
                                    cardCondition: card => context.player.opponent.creaturesInPlay.includes(card)
                                }
                            };
                        })
                    })),
                    ability.actions.sequentialForEach(context => ({
                        num: context.preThenEvents.filter(event => !event.cancelled && event.recipient === context.player.opponent && event.amount > 0).reduce((total, event) => total + event.amount, 0),
                        action: ability.actions.capture(context => {
                            return {
                                promptForSelect: {
                                    cardCondition: card => context.player.creaturesInPlay.includes(card)
                                }
                            };
                        })
                    }))
                ]
            }
        });
    }
}

Equalize.id = 'equalize';

module.exports = Equalize;
