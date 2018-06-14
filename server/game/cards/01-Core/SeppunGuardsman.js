const DrawCard = require('../../drawcard.js');

class SeppunGuardsman extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.controller.opponent && this.controller.opponent.imperialFavor !== '',
            match: this,
            effect: ability.effects.cardCannot('participateAsAttacker')
        });
    }
}

SeppunGuardsman.id = 'seppun-guardsman';

module.exports = SeppunGuardsman;
