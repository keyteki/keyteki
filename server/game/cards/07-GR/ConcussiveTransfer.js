const Card = require('../../Card.js');

class ConcussiveTransfer extends Card {
    // Play: Deal 3 to a creature. Redistribute all damage on
    // creatures among all creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 3
                })
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.removeDamage((context) => ({
                    all: true,
                    target: context.game.creaturesInPlay
                })),
                message: '{0} uses {1} to redistribute the damage on all creatures',
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.sequentialForEach((context) => ({
                        num: context.preThenEvents
                            .filter((event) => !event.cancelled && event.amount > 0)
                            .reduce((total, event) => total + event.amount, 0),
                        action: ability.actions.addDamageToken({
                            noGameStateCheck: true,
                            promptForSelect: {
                                cardType: 'creature'
                            }
                        })
                    }))
                }
            }
        });
    }
}

ConcussiveTransfer.id = 'concussive-transfer';

module.exports = ConcussiveTransfer;
