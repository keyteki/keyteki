const DrawCard = require('../../drawcard.js');

class ShinjoShono extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase skill of friendly cavalry',
            condition: context => context.source.isParticipating() &&
                                  context.game.currentConflict.hasMoreParticipants(context.player),
            effect: 'give friendly, participating cavalry +1/+1',
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.getCharacters(context.player).filter(card => card.hasTrait('cavalry')),
                effect: ability.effects.modifyBothSkills(1)
            }))
        });
    }
}

ShinjoShono.id = 'shinjo-shono';

module.exports = ShinjoShono;
