const DrawCard = require('../../drawcard.js');

class IkomaIkehata extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a character and draw a card',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isParticipating() && event.conflict.conflictType === 'political'
            },
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: 'character',
                controller: 'self',
                cardcondition: card => !card.isHonored,
                gameAction: ability.actions.honor()
            },
            gameAction: ability.actions.draw()
        });
    }
}

IkomaIkehata.id = 'ikoma-ikehata';

module.exports = IkomaIkehata;
