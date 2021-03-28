const Card = require('../../Card.js');

class CybergiantRig extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) =>
                    context.player === this.game.activePlayer &&
                    this.parent &&
                    this.parent.hasToken('power')
            },
            gameAction: ability.actions.removePowerCounter(() => ({
                target: this.parent
            }))
        });

        this.play({
            gameAction: ability.actions.heal((context) => ({
                fully: true,
                target: context.source.parent
            })),
            then: () => ({
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount: context.preThenEvent.amount,
                    target: context.source.parent
                }))
            })
        });
    }
}

CybergiantRig.id = 'cybergiant-rig';

module.exports = CybergiantRig;
