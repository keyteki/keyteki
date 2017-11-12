const DrawCard = require('../../drawcard.js');

class StoicMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentConflict.isDefending(this),
            match: card => this.game.currentConflict.isParticipating(card) && card.getCost() <= 2,
            targetController: 'any',
            effect: ability.effects.cannotCountForResolution()
        });
    }
}

StoicMagistrate.id = 'stoic-magistrate';

module.exports = StoicMagistrate;
