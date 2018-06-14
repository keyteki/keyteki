const DrawCard = require('../../drawcard.js');

class WatchCommander extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to lose 1 honor',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && context.source.parent.isParticipating()
            },
            gameAction: ability.actions.loseHonor()
        });
    }
    
    canAttach(card, context) {
        if(card.attachments && card.attachments.any(card => card.id === 'watch-commander' && card !== this)) {
            return false;
        } else if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

WatchCommander.id = 'watch-commander';

module.exports = WatchCommander;
