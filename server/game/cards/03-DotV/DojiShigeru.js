const DrawCard = require('../../drawcard.js');

class DojiShigeru extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Opponent discards a card',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.playType === 'event' &&
                                                  context.source.isParticipating()
            },
            gameAction: ability.actions.chosenDiscard()
        });
    }
}

DojiShigeru.id = 'doji-shigeru';

module.exports = DojiShigeru;
