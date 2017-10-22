const DrawCard = require('../../drawcard.js');

class VengefulOathkeeper extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                afterConflict: (event => event.conflict.loser === this.controller && 
                        event.conflict.conflictType === 'military' && this.location !== 'play area')
            },
            location: 'hand',
            handler: () => {
                this.controller.putIntoPlay(this);
                this.game.addMessage('{0} puts {1} into play from his hand', this.controller, this);
            }
        });
    }
}

VengefulOathkeeper.id = 'vengeful-oathkeeper';

module.exports = VengefulOathkeeper;

