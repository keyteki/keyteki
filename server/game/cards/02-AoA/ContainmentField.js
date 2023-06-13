const Card = require('../../Card.js');

class ContainmentField extends Card {
    // After this creature is used, destroy it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) => event.card === context.source.parent
            },
            gameAction: ability.actions.destroy((context) => ({ target: context.source.parent }))
        });
    }
}

ContainmentField.id = 'containment-field';

module.exports = ContainmentField;
