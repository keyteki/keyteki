const Card = require('../../Card.js');

class AutoLegionary extends Card {
    // Action: Put Auto-Legionary on a flank of your battleline. While in the battleline, it is considered a creature with 5 power and belongs to all houses.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.source.controller === context.game.activePlayer,
            gameAction: ability.actions.sequential([
                ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    duration: 'lastingEffect',
                    effect: [
                        ability.effects.changeType('creature'),
                        ability.effects.gainAbility('persistentEffect', {
                            effect: ability.effects.canUse((card) => card === context.source)
                        })
                    ].concat(
                        context.source.type === 'artifact' ? ability.effects.modifyPower(5) : []
                    )
                })),
                ability.actions.moveToFlank()
            ]),
            effect: 'move to a flank and become a 5-power creature'
        });
    }
}

AutoLegionary.id = 'auto-legionary';

module.exports = AutoLegionary;
