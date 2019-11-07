const BlasterCard = require('./BlasterCard.js');

class IngramsBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.name === 'Medic Ingram' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.heal({
                fully: true,
                promptForSelect: {
                    cardType: 'creature'
                }
            })
        });

        this.setupBlasterCardAbilities(ability, 'Medic Ingram');
    }
}

IngramsBlaster.id = 'ingram-s-blaster';

module.exports = IngramsBlaster;
