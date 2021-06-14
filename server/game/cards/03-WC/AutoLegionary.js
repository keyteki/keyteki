const Card = require('../../Card.js');

class AutoLegionary extends Card {
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
