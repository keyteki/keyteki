const BlasterCard = require('./BlasterCard.js');

class FranesBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Franes Blaster to First Officer Frane.
    // After you attach Franes Blaster to First Officer Frane, move each A from First Officer Frane to your pool.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'First Officer Frane' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.returnAmber((context) => ({
                all: true,
                target: context.source.parent,
                recipient: context.game.activePlayer
            }))
        });

        this.setupBlasterCardAbilities(ability, 'First Officer Frane');
    }
}

FranesBlaster.id = 'frane-s-blaster';

module.exports = FranesBlaster;
