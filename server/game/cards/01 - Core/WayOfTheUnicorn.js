const DrawCard = require('../../drawcard.js');

class WayOfTheUnicorn extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPassFirstPlayer: event => event.player === this.controller.opponent
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to keep the first player token', this.controller, this);
                context.cancel();
            }
        });
    }
}

WayOfTheUnicorn.id = 'way-of-the-unicorn';

module.exports = WayOfTheUnicorn;
