const DrawCard = require('../../drawcard.js');

class WayOfTheUnicorn extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Keep the first player token',
            when: {
                onPassFirstPlayer: (event, context) => event.player === context.player.opponent
            },
            cannotBeMirrored: true,
            effect: 'keep the first player token',
            handler: context => context.cancel()
        });
    }
}

WayOfTheUnicorn.id = 'way-of-the-unicorn';

module.exports = WayOfTheUnicorn;
