const DrawCard = require('../../../drawcard.js');

class CrowKillers extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.opponentHasHigherReserve(),
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    opponentHasHigherReserve() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return false;
        }

        return this.controller.getTotalReserve() < opponent.getTotalReserve();
    }
}

CrowKillers.code = '07041';

module.exports = CrowKillers;
