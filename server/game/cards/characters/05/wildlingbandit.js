const DrawCard = require('../../../drawcard.js');

class WildlingBandit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.isAttacking(this) &&
                this.hasLessGold()),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }

    hasLessGold() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if(!otherPlayer) {
            return false;
        }
        return this.controller.gold < otherPlayer.gold;
    }
}

WildlingBandit.code = '05041';

module.exports = WildlingBandit;
