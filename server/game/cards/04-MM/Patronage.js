const Card = require('../../Card.js');

class Patronage extends Card {
    // Play: Move half the A from a creature to your pool (rounding up). Move the remaining A from that creature to your opponents pool.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({
                    all: true
                })
            },
            then: {
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        amount: Math.ceil(context.preThenEvent.amount * 0.5)
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount:
                            context.preThenEvent.amount -
                            Math.ceil(context.preThenEvent.amount * 0.5)
                    }))
                ]
            }
        });
    }
}

Patronage.id = 'patronage';

module.exports = Patronage;
