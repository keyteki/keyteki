const DrawCard = require('../../drawcard.js');

class Reprieve extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeavesPlay: event => event.card === this.parent
            },
            canCancel: true,
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, this.parent);
                this.controller.discardCard(this);
                context.cancel();
            }
        });
    }
}

Reprieve.id = 'reprieve';

module.exports = Reprieve;
