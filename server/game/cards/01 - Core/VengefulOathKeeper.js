const DrawCard = require('../../drawcard.js');

class VengefulOathkeeper extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: (event, conflict) => conflict.loser === this.controller && conflict.conflictType === 'military'
            },
            location: 'hand',
            handler: () => this.controller.putIntoPlay(this)
        });
    }
}

VengefulOathkeeper.id = 'vengeful-oathkeeper';

module.exports = VengefulOathkeeper;

