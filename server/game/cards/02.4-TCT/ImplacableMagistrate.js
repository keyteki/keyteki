const DrawCard = require('../../drawcard.js');

class ImplacableMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
          condition: () => this.isAttacking(),
          match: card => card.isParticipating() && !card.isHonored && card !== this,
          targetController: 'any',
          effect: ability.effects.cannotCountForResolution()
        });
    }
}

ImplacableMagistrate.id = 'implacable-magistrate';

module.exports = ImplacableMagistrate;
