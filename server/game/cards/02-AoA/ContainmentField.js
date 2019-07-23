const Card = require('../../Card.js');

class ContainmentField extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('action', { gameAction: ability.actions.destroy() }),
                ability.effects.gainAbility('reap', { gameAction: ability.actions.destroy() }),
                ability.effects.gainAbility('fight', { gameAction: ability.actions.destroy() })
            ]
        });
    }
}

ContainmentField.id = 'containment-field';

module.exports = ContainmentField;
