const DrawCard = require('../../drawcard.js');

class OtomoCourtier extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.controller.opponent && this.controller.opponent.imperialFavor !== '',
            match: this,
            effect: ability.effects.cardCannot('participateAsAttacker')
        });
    }
}

OtomoCourtier.id = 'otomo-courtier';

module.exports = OtomoCourtier;
