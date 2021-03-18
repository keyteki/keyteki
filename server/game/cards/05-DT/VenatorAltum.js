const Card = require('../../Card.js');

class VenatorAltum extends Card {
    // After Venator Altum is dealt damage, if the tide is low, exalt Venator Altum.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.card === context.source
            },
            condition: (context) => context.source.controller.isTideLow(),
            gameAction: ability.actions.exalt()
        });
    }
}

VenatorAltum.id = 'venator-altum';

module.exports = VenatorAltum;
