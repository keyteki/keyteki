const DrawCard = require('../../../drawcard.js');

class KingBeyondTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this.parent) && this.hasLessTotalPower(),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('Wildling') || card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }

    hasLessTotalPower() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if(!otherPlayer) {
            return false;
        }
        return this.controller.getTotalPower() < otherPlayer.getTotalPower();
    }
}

KingBeyondTheWall.code = '04079';

module.exports = KingBeyondTheWall;
