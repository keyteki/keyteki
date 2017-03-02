const DrawCard = require('../../../drawcard.js');

class YoungSpearwife extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasLessFactionPower(),
            match: this,
            effect: ability.effects.addKeyword('Stealth')
        });
    }

    hasLessFactionPower() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if(!otherPlayer) {
            return false;
        }
        return this.controller.faction.power < otherPlayer.faction.power;
    }
}

YoungSpearwife.code = '03040';

module.exports = YoungSpearwife;
