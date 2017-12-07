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

CunningMagistrate.id = 'cunning-magistrate'; // This is a guess at what the id might be - please check it!!!

module.exports = CunningMagistrate;
