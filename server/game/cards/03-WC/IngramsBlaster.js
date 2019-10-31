const BlasterCard = require('./BlasterCard.js');

class IngramsBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.card === this && event.parent.name === 'Medic Ingram'
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
