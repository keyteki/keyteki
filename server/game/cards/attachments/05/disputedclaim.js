const DrawCard = require('../../../drawcard.js');

class DisputedClaim extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer || this.controller.faction.power > otherPlayer.faction.power) {
                    return true;
                }
                return false;
            },
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('Renown')
            ]
        });
    }

    canAttach(player, card) {
        if(!(card.hasTrait('Bastard') || card.hasTrait('Lord') || card.hasTrait('Lady'))) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

DisputedClaim.code = '05026';

module.exports = DisputedClaim;
