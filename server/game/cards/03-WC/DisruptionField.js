const Card = require('../../Card.js');

class DisruptionField extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.addDisruptionCounter({ target: this })
            })
        });

        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.addDisruptionCounter({ target: this })
            })
        });

        this.persistentEffect({
            condition: (context) => context.source.hasToken('disruption'),
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                (player, context) => context.source.tokens.disruption || 0
            )
        });
    }
}

DisruptionField.id = 'disruption-field';

module.exports = DisruptionField;
