const DrawCard = require('../../drawcard.js');

class StewardOfLaw extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetController: 'any',
            match: card => card.getType() === 'character' && card.location === 'play area',
            effect: ability.effects.cannotBecomeDishonored()
        });
    }
}

StewardOfLaw.id = 'steward-of-law';

module.exports = StewardOfLaw;

