const BlasterCard = require('./BlasterCard.js');

class FranesBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.card === this && event.parent.name === 'First Officer Frane'
            },
            gameAction: ability.actions.returnAmber(context => ({ all: true, target: context.source.parent, recipient: context.game.activePlayer }))
        });

        this.setupBlasterCardAbilities(ability, 'Frane\'s Blaster', 'First Officer Frane');
    }
}

FranesBlaster.id = 'frane-s-blaster';

module.exports = FranesBlaster;
