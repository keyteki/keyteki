const Card = require('../../Card.js');

class CybergiantRig extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('interrupt', {
                when: {
                    onRoundEnded: (_event, context) =>
                        context.player === context.game.activePlayer &&
                        context.source.hasToken('power')
                },
                gameAction: ability.actions.removePowerCounter()
            })
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
