const BlasterCard = require('./BlasterCard.js');

class ChansBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Commander Chan' &&
                    event.context.player === event.card.controller
            },
            target: {
                optional: true,
                mode: 'exactly',
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.exhausted === false && card !== this.parent,
                gameAction: ability.actions.use()
            }
        });

        this.setupBlasterCardAbilities(ability, 'Commander Chan');
    }
}

ChansBlaster.id = 'chan-s-blaster';

module.exports = ChansBlaster;
