import Card from '../../Card.js';

class PrototypeHarness extends Card {
    // This creature gets +6 power and gains, “At the start of your
    // turn, deal 1D to this creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyPower(6),
                ability.effects.gainAbility('reaction', {
                    when: {
                        onBeginRound: (_event, context) =>
                            context.player === context.game.activePlayer
                    },
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: 1,
                        target: context.source,
                        damageSource: context.source
                    }))
                })
            ]
        });
    }
}

PrototypeHarness.id = 'prototype-harness';

export default PrototypeHarness;
