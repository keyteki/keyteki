const BlasterCard = require('./BlasterCard.js');

class ChansBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.card === this && event.parent.name === 'Commander Chan'
            },
            gameAction: ability.actions.use({
                promptForSelect: {
                    optional: true,
                    controller: 'self',
                    cardType: 'creature',
                    cardCondition: card => (card.exhausted === false) && (card !== this.parent)
                }
            })
        });

        this.setupBlasterCardAbilities(ability, 'Commander Chan');
    }
}

ChansBlaster.id = 'chan-s-blaster';

module.exports = ChansBlaster;
