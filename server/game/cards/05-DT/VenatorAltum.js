import Card from '../../Card.js';

class VenatorAltum extends Card {
    // (T) After Venator Altum is dealt damage, if the tide is low, exalt Venator Altum.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageApplied: (event, context) => event.card === context.source
            },
            condition: (context) => context.source.controller.isTideLow(),
            gameAction: ability.actions.exalt()
        });
    }
}

VenatorAltum.id = 'venator-altum';

export default VenatorAltum;
