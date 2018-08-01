const DrawCard = require('../../drawcard.js');

class MinamiKazeRegulars extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a fate and draw a card',
            when: {
                afterConflict: (event, context) => 
                    event.conflict.winner === context.player &&
                    context.source.isParticipating() &&
                    context.game.currentConflict.hasMoreParticipants(context.player)
            },
            gameAction: [
                ability.actions.gainFate(),
                ability.actions.draw()
            ],
            effect: 'gain a fate and draw a card'
        });
    }
}

MinamiKazeRegulars.id = 'minami-kaze-regulars';

module.exports = MinamiKazeRegulars;
