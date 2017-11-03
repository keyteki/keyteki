const DrawCard = require('../../drawcard.js');

class SeppunGuardsman extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.opponent && this.controller.opponent.imperialFavor !== '',
            match: this,
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

SeppunGuardsman.id = 'seppun-guardsman';

module.exports = SeppunGuardsman;
