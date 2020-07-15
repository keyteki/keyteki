const Card = require('../../Card.js');

class AutoLegionary extends Card {
    setupCardAbilities(ability) {
        let effects = [
            ability.effects.changeType('creature'),
            ability.effects.canUse((card) => card === this)
        ];

        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    duration: 'lastingEffect',
                    effect:
                        context.source && context.source.type === 'artifact'
                            ? effects.concat(ability.effects.modifyPower(5))
                            : effects
                })),
                ability.actions.moveToFlank()
            ])
        });
    }
}

AutoLegionary.id = 'auto-legionary';

module.exports = AutoLegionary;
