const DrawCard = require('../../drawcard.js');

class Reprieve extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeavesPlay: params => params.card === this.parent
            },
            canCancel: true,
            handler: (context) => {
                context.cancel();
                this.controller.discardCard(this);
            }
        });
    }
}

Reprieve.id = 'reprieve';

module.exports = Reprieve;
