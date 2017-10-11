const DrawCard = require('../../drawcard.js');

class SeppunGuardsman extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getOtherPlayer(this.controller).imperialFavor !== '',
            match: this,
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

SeppunGuardsman.id = 'seppun-guardsman';

module.exports = SeppunGuardsman;
