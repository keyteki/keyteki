const Card = require('../../Card.js');

class DisruptionField extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.addDisruptionCounter(context => ({ target: this }))
            })
        });
        
        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.addDisruptionCounter(context => ({ target: this }))
            })
        });
    }
}

DisruptionField.id = 'disruption-field';

module.exports = DisruptionField;
