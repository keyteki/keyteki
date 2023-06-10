const BlasterCard = require('./BlasterCard.js');

class KirbysBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Kirbys Blaster to Com. Officer Kirby.
    // After you attach Kirbys Blaster to Com. Officer Kirby, draw 2 cards.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Com. Officer Kirby' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.draw({ amount: 2 })
        });

        this.setupBlasterCardAbilities(ability, 'Com. Officer Kirby');
    }
}

KirbysBlaster.id = 'kirby-s-blaster';

module.exports = KirbysBlaster;
