const DrawCard = require('../../drawcard.js');

class IsawaTadaka extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: player => !this.game.rings.earth.isConsideredClaimed(player),
            effect: ability.effects.playerCannot('play', context => (
                context.source.type === 'event' && 
                context.player.conflictDiscardPile.any(card => card.name === context.source.name))
            )
        });
    }
}

IsawaTadaka.id = 'isawa-tadaka';

module.exports = IsawaTadaka;
