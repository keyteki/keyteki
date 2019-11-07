const BlasterCard = require('./BlasterCard.js');

class ChansBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.name === 'Commander Chan' &&
                    event.context.player === event.card.controller
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
