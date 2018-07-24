const DrawCard = require('../../drawcard.js');

class CallowDelegate extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.interrupt({
            title: 'Honor a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                location: 'play area',
                controller: 'self',
                gameAction: ability.actions.honor()
            }
        });
    }
}

CallowDelegate.id = 'callow-delegate';

module.exports = CallowDelegate;
