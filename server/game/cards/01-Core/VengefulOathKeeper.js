const DrawCard = require('../../drawcard.js');

class VengefulOathkeeper extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put this into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && 
                                                   event.conflict.conflictType === 'military'
            },
            location: 'hand',
            gameAction: ability.actions.putIntoPlay()
        });
    }
}

VengefulOathkeeper.id = 'vengeful-oathkeeper';

module.exports = VengefulOathkeeper;

