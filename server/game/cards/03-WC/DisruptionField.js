const Card = require('../../Card.js');

class DisruptionField extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.addDisruptionCounter(() => ({ target: this }))
            })
        });

        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.addDisruptionCounter(() => ({ target: this }))
            })
        });

        this.persistentEffect({
            condition: () => this.controller.opponent && this.hasToken('disruption'),
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() => this.tokens.disruption)
        });
    }
}

DisruptionField.id = 'disruption-field';

module.exports = DisruptionField;
