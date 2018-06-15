const DrawCard = require('../../drawcard.js');

class SilverTonguedMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: card => card.isParticipating() && card.fate === 0 && card !== this,
            targetController: 'any',
            effect: ability.effects.cannotCountForResolution()
        });
    }
}

SilverTonguedMagistrate.id = 'silver-tongued-magistrate';

module.exports = SilverTonguedMagistrate;
