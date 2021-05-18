const Card = require('../../Card.js');

class TirelessCrocag extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.cardCannot('reap'),
                ability.effects.terminalCondition({
                    condition: (context) =>
                        !context.source.controller.opponent ||
                        context.source.controller.opponent.creaturesInPlay.length === 0,
                    message: '{0} is destroyed as there are no enemy creatures',
                    gameAction: ability.actions.destroy()
                })
            ]
        });

        this.persistentEffect({
            effect: ability.effects.canUse(
                (card, context, effectContext) => card === effectContext.source
            )
        });
    }
}

TirelessCrocag.id = 'tireless-crocag';

module.exports = TirelessCrocag;
