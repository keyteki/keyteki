const BlasterCard = require('./BlasterCard.js');

class ChansBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Chans Blaster to Commander Chan.
    // After you attach Chans Blaster to Commander Chan, you may use another friendly creature.
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
