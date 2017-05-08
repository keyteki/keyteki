const DrawCard = require('../../../drawcard.js');

class FishingNet extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
    canAttach(player, card) {
        if(card.getType() !== 'character' || card.controller === this.controller) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

FishingNet.code = '02052';

module.exports = FishingNet;
