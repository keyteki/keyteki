const DrawCard = require('../../drawcard.js');

class OtomoCourtier extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetLocation: 'any',
            condition: () => this.controller.opponent && this.controller.opponent.imperialFavor !== '',
            match: this,
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

OtomoCourtier.id = 'otomo-courtier';

module.exports = OtomoCourtier;
