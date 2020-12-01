const Card = require('../../Card.js');

class AutoLegionary extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    duration: 'lastingEffect',
                    effect: [
                        ability.effects.changeType('creature'),
                        ability.effects.canUse((card) => card === context.source)
                    ].concat(
                        context.source.type === 'artifact' ? ability.effects.modifyPower(5) : []
                    )
                })),
                ability.actions.moveToFlank()
            ])
        });
    }
}

AutoLegionary.id = 'auto-legionary';

module.exports = AutoLegionary;
