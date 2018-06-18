const DrawCard = require('../../drawcard.js');

class BeastmasterMatriarch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyMilitarySkill(() => this.getTwiceOpponentsClaimedRings())
        });
    }

    getTwiceOpponentsClaimedRings() {
        if(!this.controller.opponent) {
            return 0;
        }
        return 2 * this.controller.opponent.getClaimedRings().length;
    }
}

BeastmasterMatriarch.id = 'beastmaster-matriarch';

module.exports = BeastmasterMatriarch;
