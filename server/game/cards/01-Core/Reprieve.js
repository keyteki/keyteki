const DrawCard = require('../../drawcard.js');

class Reprieve extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: event => event.card === this.parent
            },
            canCancel: true,
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, this.parent);
                let window = context.event.window;
                context.cancel();
                this.game.addEventToWindow(window, 'onCardLeavesPlay', { card: this, destination: 'conflict discard pile' });
            }
        });
    }
}

Reprieve.id = 'reprieve';

module.exports = Reprieve;
