const DrawCard = require('../../drawcard.js');

class CloudTheMind extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank()
        });
    }

    canPlay(context) {
        if(!context.player.cardsInPlay.any(card => card.getType() === 'character' && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context);
    }
}

CloudTheMind.id = 'cloud-the-mind';

module.exports = CloudTheMind;


