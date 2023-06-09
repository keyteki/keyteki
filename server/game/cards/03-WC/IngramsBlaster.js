const BlasterCard = require('./BlasterCard.js');

class IngramsBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Ingrams Blaster to Medic Ingram.
    // After you attach Ingrams Blaster to Medic Ingram, fully heal a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Medic Ingram' &&
                    event.context.player === event.card.controller
            },
            target: {
                mode: 'exactly',
                cardType: 'creature',
                gameAction: ability.actions.heal({ fully: true })
            }
        });

        this.setupBlasterCardAbilities(ability, 'Medic Ingram');
    }
}

IngramsBlaster.id = 'ingram-s-blaster';

module.exports = IngramsBlaster;
