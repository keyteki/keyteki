const DrawCard = require('../../drawcard.js');

class IsawaTadaka extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'opponent',
            match: player => !this.game.rings.earth.isConsideredClaimed(player),
            effect: ability.effects.cannotPlay(context => (
                context && context.source.type === 'event' && 
                context.player.conflictDiscardPile.any(card => card.name === context.source.name && card !== context.source))
            )
        });
    }
}

IsawaTadaka.id = 'isawa-tadaka';

module.exports = IsawaTadaka;
