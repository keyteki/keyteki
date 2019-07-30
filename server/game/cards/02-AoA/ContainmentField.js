const Card = require('../../Card.js');

class ContainmentField extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('constant', {
                when: {
                    onCardExhausted: event => (event.card === this.parent)
                },
                gameAction: ability.actions.destroy()
            })
        });
    }
}

ContainmentField.id = 'containment-field';

module.exports = ContainmentField;
