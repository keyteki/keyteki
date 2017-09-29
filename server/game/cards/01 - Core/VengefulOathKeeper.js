const DrawCard = require('../../drawcard.js');

class VengefulOathkeeper extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: (event, params) => params.conflict.loser === this.controller && params.conflict.conflictType === 'military'
            },
            location: 'hand',
            handler: () => this.controller.putIntoPlay(this)
        });
    }
}

VengefulOathkeeper.id = 'vengeful-oathkeeper';

module.exports = VengefulOathkeeper;

