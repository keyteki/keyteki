const DrawCard = require('../../drawcard.js');

class SwiftMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: card => card.isParticipating() && card.fate > 0 && card !== this,
            targetController: 'any',
            effect: ability.effects.cannotCountForResolution()
        });
    }
}

SwiftMagistrate.id = 'swift-magistrate';

module.exports = SwiftMagistrate;
