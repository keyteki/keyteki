const DrawCard = require('../../drawcard.js');

class CunningMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: card => card.isParticipating() && card.isDishonored && card !== this,
            targetController: 'any',
            effect: ability.effects.cannotCountForResolution()
        });
    }
}

CunningMagistrate.id = 'cunning-magistrate';

module.exports = CunningMagistrate;
